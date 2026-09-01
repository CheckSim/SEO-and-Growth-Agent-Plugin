/**
 * Live Site Crawler & Technical Page Auditor
 * 100% Free, Zero-Dependency DOM & HTTP Inspection Engine
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

function fetchPage(targetUrl, followRedirects = true, maxRedirects = 5) {
  return new Promise((resolve) => {
    let redirectsCount = 0;
    
    function makeRequest(currentUrl) {
      try {
        const parsed = new URL(currentUrl);
        const client = parsed.protocol === 'https:' ? https : http;
        const startTime = Date.now();

        const req = client.get(currentUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SEOGrowthBot/1.0; +https://github.com/CheckSim/SEO-Agent-Plugin)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        }, (res) => {
          const responseTimeMs = Date.now() - startTime;
          const statusCode = res.statusCode;

          if (followRedirects && (statusCode === 301 || statusCode === 302 || statusCode === 307 || statusCode === 308) && res.headers.location && redirectsCount < maxRedirects) {
            redirectsCount++;
            const nextUrl = new URL(res.headers.location, currentUrl).href;
            res.resume();
            return makeRequest(nextUrl);
          }

          let html = '';
          res.setEncoding('utf8');
          res.on('data', chunk => { 
            html += chunk;
            if (html.length > 2000000) { // Limit to 2MB to prevent memory explosion
              res.destroy();
            }
          });
          res.on('end', () => {
            resolve({
              url: currentUrl,
              finalUrl: currentUrl,
              statusCode,
              headers: res.headers,
              responseTimeMs,
              html,
              redirectsCount
            });
          });
        });

        req.on('error', (err) => {
          resolve({
            url: currentUrl,
            error: err.message,
            statusCode: 0,
            responseTimeMs: Date.now() - startTime
          });
        });

        req.setTimeout(10000, () => {
          req.destroy();
          resolve({
            url: currentUrl,
            error: 'Timeout after 10000ms',
            statusCode: 0,
            responseTimeMs: 10000
          });
        });
      } catch (err) {
        resolve({
          url: currentUrl,
          error: err.message,
          statusCode: 0,
          responseTimeMs: 0
        });
      }
    }

    makeRequest(targetUrl);
  });
}

function extractTagContent(html, regex) {
  const match = regex.exec(html);
  return match ? match[1].trim() : null;
}

function extractAllMatches(html, regex) {
  const results = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    if (match[1]) results.push(match[1].trim());
  }
  return results;
}

async function auditPageTechnical({ url }) {
  const page = await fetchPage(url);
  if (page.error || page.statusCode !== 200) {
    return {
      url,
      status: page.statusCode,
      error: page.error || `HTTP Status ${page.statusCode}`,
      responseTimeMs: page.responseTimeMs
    };
  }

  const html = page.html;

  // Title tag
  const title = extractTagContent(html, /<title[^>]*>([^<]+)<\/title>/i);
  const titleLength = title ? title.length : 0;
  const titleScore = !title ? 'MISSING' : (titleLength >= 30 && titleLength <= 60) ? 'GOOD' : (titleLength < 30) ? 'TOO_SHORT' : 'TOO_LONG';

  // Meta Description
  const metaDescMatch = /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i.exec(html) ||
                        /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i.exec(html);
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : null;
  const descLength = metaDescription ? metaDescription.length : 0;
  const descScore = !metaDescription ? 'MISSING' : (descLength >= 70 && descLength <= 160) ? 'GOOD' : (descLength < 70) ? 'TOO_SHORT' : 'TOO_LONG';

  // Canonical tag
  const canonicalMatch = /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i.exec(html) ||
                         /<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i.exec(html);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : null;
  const isSelfCanonical = canonical ? (canonical === url || canonical === page.finalUrl) : false;

  // Meta Robots
  const robotsMatch = /<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i.exec(html);
  const metaRobots = robotsMatch ? robotsMatch[1].trim().toLowerCase() : 'index, follow (default)';

  // Headings
  const h1Tags = extractAllMatches(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map(s => s.replace(/<[^>]+>/g, '').trim());
  const h2Tags = extractAllMatches(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi).map(s => s.replace(/<[^>]+>/g, '').trim()).slice(0, 15);
  const h3Tags = extractAllMatches(html, /<h3[^>]*>([\s\S]*?)<\/h3>/gi).map(s => s.replace(/<[^>]+>/g, '').trim()).slice(0, 10);

  // Images & Missing Alt
  const imgRegex = /<img([^>]+)>/gi;
  let totalImages = 0;
  let imagesWithoutAlt = [];
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    totalImages++;
    const imgAttributes = imgMatch[1];
    if (!/alt=["'][^"']+["']/i.test(imgAttributes)) {
      const srcMatch = /src=["']([^"']+)["']/i.exec(imgAttributes);
      if (srcMatch && imagesWithoutAlt.length < 10) {
        imagesWithoutAlt.push(srcMatch[1]);
      }
    }
  }

  // OpenGraph & Social Cards
  const ogTitle = extractTagContent(html, /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
  const ogImage = extractTagContent(html, /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i);
  const ogDescription = extractTagContent(html, /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
  const twitterCard = extractTagContent(html, /<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']*)["']/i);

  // JSON-LD Schemas
  const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const jsonLdBlocks = [];
  const detectedTypes = [];
  let jsonMatch;
  while ((jsonMatch = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      jsonLdBlocks.push(parsed);
      const type = parsed['@type'] || (parsed['@graph'] ? parsed['@graph'].map(g => g['@type']).join(', ') : 'Unknown');
      detectedTypes.push(type);
    } catch {
      detectedTypes.push('Invalid JSON-LD Syntax');
    }
  }

  // Links
  const linkRegex = /<a[^>]*href=["']([^"'#]+)["']/gi;
  let internalLinksCount = 0;
  let externalLinksCount = 0;
  let linkMatch;
  const parsedHost = new URL(url).hostname;
  while ((linkMatch = linkRegex.exec(html)) !== null) {
    const href = linkMatch[1];
    if (href.startsWith('/') || href.includes(parsedHost)) {
      internalLinksCount++;
    } else if (href.startsWith('http')) {
      externalLinksCount++;
    }
  }

  return {
    url,
    statusCode: page.statusCode,
    responseTimeMs: page.responseTimeMs,
    redirectsCount: page.redirectsCount,
    seoAudit: {
      title: { value: title, length: titleLength, status: titleScore },
      metaDescription: { value: metaDescription, length: descLength, status: descScore },
      canonical: { value: canonical, isSelfCanonical },
      metaRobots,
      headings: {
        h1Count: h1Tags.length,
        h1List: h1Tags,
        h1Status: h1Tags.length === 1 ? 'OPTIMAL' : (h1Tags.length === 0 ? 'MISSING' : 'MULTIPLE_H1_WARNING'),
        h2Count: h2Tags.length,
        h2Sample: h2Tags,
        h3Count: h3Tags.length
      },
      images: {
        totalImages,
        missingAltCount: imagesWithoutAlt.length,
        missingAltSample: imagesWithoutAlt
      },
      socialOpenGraph: {
        ogTitle: ogTitle || 'MISSING',
        ogDescription: ogDescription || 'MISSING',
        ogImage: ogImage || 'MISSING',
        twitterCard: twitterCard || 'MISSING'
      },
      structuredData: {
        blocksFound: jsonLdBlocks.length,
        detectedTypes
      },
      linksSummary: {
        internalLinksCount,
        externalLinksCount
      }
    }
  };
}

async function crawlSiteSitemap({ sitemapUrl, maxUrls = 30 }) {
  const sitemapResponse = await fetchPage(sitemapUrl);
  if (sitemapResponse.error || sitemapResponse.statusCode !== 200) {
    return {
      sitemapUrl,
      error: `Impossibile scaricare la sitemap: ${sitemapResponse.error || sitemapResponse.statusCode}`,
      statusCode: sitemapResponse.statusCode
    };
  }

  const xml = sitemapResponse.html;
  const locRegex = /<loc>([^<]+)<\/loc>/gi;
  const urls = [];
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    const loc = match[1].trim();
    if (!loc.endsWith('.xml') && urls.length < maxUrls) {
      urls.push(loc);
    }
  }

  if (urls.length === 0) {
    return {
      sitemapUrl,
      message: 'Nessun URL standard trovato (potrebbe essere una sitemap index che punta ad altre sitemap .xml)',
      rawLocsFound: extractAllMatches(xml, /<loc>([^<]+)<\/loc>/gi).slice(0, 10)
    };
  }

  // Crawl URLs with concurrency limit = 5
  const results = [];
  const chunks = [];
  const chunkSize = 5;
  for (let i = 0; i < urls.length; i += chunkSize) {
    chunks.push(urls.slice(i, i + chunkSize));
  }

  for (const chunk of chunks) {
    const batch = await Promise.all(chunk.map(u => fetchPage(u, false)));
    results.push(...batch);
  }

  const summary = {
    sitemapUrl,
    totalUrlsChecked: results.length,
    status200Ok: results.filter(r => r.statusCode === 200).length,
    status3xxRedirect: results.filter(r => r.statusCode >= 300 && r.statusCode < 400).length,
    status4xxBroken: results.filter(r => r.statusCode >= 400 && r.statusCode < 500).length,
    status5xxError: results.filter(r => r.statusCode >= 500).length,
    averageResponseTimeMs: Math.round(results.reduce((acc, r) => acc + (r.responseTimeMs || 0), 0) / (results.length || 1)),
    brokenUrls: results.filter(r => r.statusCode >= 400).map(r => ({ url: r.url, statusCode: r.statusCode })),
    redirects: results.filter(r => r.statusCode >= 300 && r.statusCode < 400).map(r => ({ url: r.url, statusCode: r.statusCode, location: r.headers.location }))
  };

  return summary;
}

module.exports = {
  auditPageTechnical,
  crawlSiteSitemap
};
