/**
 * Live SERP & Competitor Intelligence Engine
 * Serper.dev integration (optional) + Deep Competitor Content Analyzer
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

function fetchPageContent(targetUrl) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(targetUrl);
      const client = parsed.protocol === 'https:' ? https : http;
      const req = client.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      }, (res) => {
        let html = '';
        res.setEncoding('utf8');
        res.on('data', chunk => {
          html += chunk;
          if (html.length > 2500000) res.destroy();
        });
        res.on('end', () => {
          resolve({ html, statusCode: res.statusCode });
        });
      });
      req.on('error', err => resolve({ error: err.message, statusCode: 0 }));
      req.setTimeout(8000, () => {
        req.destroy();
        resolve({ error: 'Timeout', statusCode: 0 });
      });
    } catch (err) {
      resolve({ error: err.message, statusCode: 0 });
    }
  });
}

async function inspectLiveSerp({ query, country = 'it', numResults = 10, serperApiKey }) {
  if (!serperApiKey) {
    return {
      query,
      configured: false,
      message: 'Per visualizzare la SERP live di Google con People Also Ask e ranking esatti 1-100, aggiungi "serper_api_key" in credentials.json. (2.500 ricerche gratuite senza carta di credito su https://serper.dev).',
      fallbackGuidance: `Puoi analizzare direttamente le pagine concorrenti con il tool "analyze_competitor_content" passando l'URL del competitor.`
    };
  }

  return new Promise((resolve) => {
    const postData = JSON.stringify({
      q: query,
      gl: country,
      hl: country === 'it' ? 'it' : 'en',
      num: numResults
    });

    const req = https.request({
      hostname: 'google.serper.dev',
      path: '/search',
      method: 'POST',
      headers: {
        'X-API-KEY': serperApiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const organic = (parsed.organic || []).map((item, idx) => ({
            position: item.position || idx + 1,
            title: item.title,
            link: item.link,
            snippet: item.snippet,
            sitelinks: item.sitelinks ? item.sitelinks.map(s => s.title) : []
          }));

          const peopleAlsoAsk = (parsed.peopleAlsoAsk || []).map(p => ({
            question: p.question,
            snippet: p.snippet,
            title: p.title,
            link: p.link
          }));

          resolve({
            query,
            country,
            totalResults: parsed.searchParameters ? parsed.searchParameters.num : organic.length,
            knowledgeGraph: parsed.knowledgeGraph || null,
            organic,
            peopleAlsoAsk,
            relatedSearches: (parsed.relatedSearches || []).map(r => r.query)
          });
        } catch (e) {
          resolve({ error: 'Errore parsing risposta Serper.dev: ' + e.message });
        }
      });
    });

    req.on('error', err => resolve({ error: err.message }));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ error: 'Timeout Serper.dev' });
    });

    req.write(postData);
    req.end();
  });
}

async function analyzeCompetitorContent({ url }) {
  const { html, error, statusCode } = await fetchPageContent(url);
  if (error || statusCode !== 200) {
    return {
      url,
      error: error || `HTTP ${statusCode}`,
      statusCode
    };
  }

  // Extract title and meta description
  const titleMatch = /<title[^>]*>([^<]+)<\/title>/i.exec(html);
  const title = titleMatch ? titleMatch[1].trim() : 'N/A';

  const metaDescMatch = /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i.exec(html) ||
                        /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i.exec(html);
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : 'N/A';

  // Headings outline
  const headingRegex = /<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi;
  const headings = [];
  let hMatch;
  while ((hMatch = headingRegex.exec(html)) !== null) {
    const level = hMatch[1].toUpperCase();
    const text = hMatch[2].replace(/<[^>]+>/g, '').trim();
    if (text) headings.push({ level, text });
  }

  // Strip boilerplate (script, style, nav, footer, header, noscript)
  let cleanHtml = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '');

  const textContent = cleanHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = textContent.split(/\s+/).filter(w => w.length > 2);
  const wordCount = words.length;
  const estimatedReadingTimeMinutes = Math.ceil(wordCount / 200);

  // Top 2-word ngrams (frequency)
  const ngrams = {};
  for (let i = 0; i < words.length - 1; i++) {
    const pair = `${words[i].toLowerCase()} ${words[i + 1].toLowerCase()}`;
    if (!/^[a-zà-ú0-9\s]+$/i.test(pair)) continue;
    ngrams[pair] = (ngrams[pair] || 0) + 1;
  }

  const topPhrases = Object.entries(ngrams)
    .filter(([_, count]) => count > 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([phrase, count]) => ({ phrase, count }));

  // Embedded JSON-LD schemas
  const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const schemas = [];
  let jMatch;
  while ((jMatch = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(jMatch[1]);
      schemas.push(parsed['@type'] || 'Custom JSON-LD');
    } catch {}
  }

  return {
    url,
    title,
    metaDescription,
    wordCount,
    estimatedReadingTimeMinutes,
    headingsOutline: headings,
    topFrequentPhrases: topPhrases,
    structuredDataTypesFound: schemas
  };
}

module.exports = {
  inspectLiveSerp,
  analyzeCompetitorContent
};
