/**
 * Generative Engine Optimization (GEO) & LLM Citation Benchmark Engine
 * llms.txt validator & Perplexity/Gemini AI Citation Tracker
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

function fetchContent(targetUrl) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(targetUrl);
      const client = parsed.protocol === 'https:' ? https : http;
      const req = client.get(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LLM-Linter/1.0)' }
      }, (res) => {
        let text = '';
        res.on('data', chunk => { text += chunk; });
        res.on('end', () => resolve({ text, statusCode: res.statusCode }));
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

async function validateLlmsTxt({ content, url }) {
  let rawText = content;
  let source = 'direct_content';

  if (!rawText && url) {
    const res = await fetchContent(url);
    if (res.error || res.statusCode !== 200) {
      return {
        url,
        valid: false,
        error: `Impossibile scaricare llms.txt dall'URL indicato: ${res.error || res.statusCode}`
      };
    }
    rawText = res.text;
    source = url;
  }

  if (!rawText) {
    return {
      valid: false,
      error: 'Nessun contenuto o URL fornito per la validazione di llms.txt'
    };
  }

  const lines = rawText.split('\n');
  const errors = [];
  const warnings = [];
  const recommendations = [];

  // Check H1 Title
  const hasH1 = lines.some(l => /^#\s+[^#]/.test(l.trim()));
  if (!hasH1) {
    errors.push('Manca il titolo principale H1 (es. "# Nome Progetto / Brand").');
  }

  // Check Blockquote Summary
  const hasBlockquote = lines.some(l => /^>\s+/.test(l.trim()));
  if (!hasBlockquote) {
    warnings.push('Manca il sommario in blockquote (es. "> Breve sintesi di 1-2 frasi sul servizio").');
  }

  // Extract Markdown Links
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
  const linksFound = [];
  let match;
  while ((match = linkRegex.exec(rawText)) !== null) {
    linksFound.push({ label: match[1], url: match[2] });
  }

  if (linksFound.length === 0) {
    warnings.push('Nessun link markdown rilevato. Il file llms.txt dovrebbe linkare le sezioni chiave del sito.');
  }

  // Check Sections (H2)
  const h2Sections = lines.filter(l => /^##\s+/.test(l.trim())).map(l => l.replace(/^##\s+/, '').trim());
  if (h2Sections.length === 0) {
    warnings.push('Nessuna sezione H2 (##) definita per categorizzare tool, servizi o documentazione.');
  }

  // Information density score
  const wordCount = rawText.split(/\s+/).filter(w => w.length > 0).length;
  let score = 100;
  if (!hasH1) score -= 30;
  if (!hasBlockquote) score -= 20;
  if (linksFound.length === 0) score -= 20;
  if (h2Sections.length === 0) score -= 15;

  return {
    source,
    valid: errors.length === 0,
    score: Math.max(0, score),
    summary: {
      hasH1,
      hasBlockquoteSummary: hasBlockquote,
      h2SectionsCount: h2Sections.length,
      h2Sections,
      linksFoundCount: linksFound.length,
      linksSample: linksFound.slice(0, 10),
      wordCount
    },
    errors,
    warnings,
    geoTips: [
      'Mantieni le descrizioni dei link brevi e assertive (cosa fa il servizio in < 150 caratteri).',
      'Includi un link al file esteso llms-full.txt per la documentazione approfondita.',
      'Specifica sempre il modello di pricing e le policy chiave nelle prime sezioni.'
    ]
  };
}

async function testAiBrandCitation({ brandName, domain, queries, perplexityApiKey, geminiApiKey }) {
  const queryList = Array.isArray(queries) ? queries : [queries];
  const targetBrand = (brandName || '').toLowerCase();
  const targetDomain = (domain || '').toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');

  if (!perplexityApiKey && !geminiApiKey) {
    return {
      configured: false,
      message: 'Per testare le citazioni del tuo brand in tempo reale su Perplexity AI, aggiungi "perplexity_api_key" in credentials.json.',
      guidance: `Per massimizzare la visibilità su motori generativi (ChatGPT, Perplexity, Gemini) senza API key, assicurati di implementare llms.txt, tabelle semantiche HTML e Schema.org FAQPage / Organization.`
    };
  }

  if (perplexityApiKey) {
    const results = [];
    for (const q of queryList) {
      try {
        const postData = JSON.stringify({
          model: 'sonar',
          messages: [{ role: 'user', content: q }]
        });

        const resData = await new Promise((resolve, reject) => {
          const req = https.request({
            hostname: 'api.perplexity.ai',
            path: '/chat/completions',
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${perplexityApiKey}`,
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(postData)
            }
          }, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => resolve(JSON.parse(data)));
          });
          req.on('error', reject);
          req.write(postData);
          req.end();
        });

        const replyContent = (resData.choices && resData.choices[0] && resData.choices[0].message.content) || '';
        const citations = resData.citations || [];

        const brandMentionedInText = replyContent.toLowerCase().includes(targetBrand);
        const domainCited = citations.some(c => c.toLowerCase().includes(targetDomain));

        results.push({
          query: q,
          brandMentionedInText,
          domainCitedInSources: domainCited,
          citationsCount: citations.length,
          citationsSources: citations.slice(0, 5),
          responseSnippet: replyContent.slice(0, 300)
        });
      } catch (err) {
        results.push({ query: q, error: err.message });
      }
    }

    const successfulTests = results.filter(r => !r.error);
    const citationRate = successfulTests.length > 0 
      ? Math.round((successfulTests.filter(r => r.brandMentionedInText || r.domainCitedInSources).length / successfulTests.length) * 100)
      : 0;

    return {
      engine: 'Perplexity AI (Sonar)',
      brandName,
      domain: targetDomain,
      totalQueriesTested: queryList.length,
      overallCitationRate: `${citationRate}%`,
      details: results
    };
  }
}

module.exports = {
  validateLlmsTxt,
  testAiBrandCitation
};
