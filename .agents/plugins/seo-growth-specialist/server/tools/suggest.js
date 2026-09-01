/**
 * Google & Bing Suggest Keyword Intent Engine
 * 100% Free, Zero API Keys, Unlimited Long-Tail Intent Tree Generator
 */

const https = require('https');
const http = require('http');

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      resolve([]);
    });
  });
}

async function queryGoogleSuggest(query, lang = 'it', country = 'it') {
  try {
    const url = `https://suggestqueries.google.com/complete/search?client=chrome&hl=${encodeURIComponent(lang)}&gl=${encodeURIComponent(country)}&q=${encodeURIComponent(query)}`;
    const data = await fetchJson(url);
    if (Array.isArray(data) && Array.isArray(data[1])) {
      return data[1];
    }
    return [];
  } catch {
    return [];
  }
}

async function queryBingSuggest(query) {
  try {
    const url = `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(query)}`;
    const data = await fetchJson(url);
    if (Array.isArray(data) && Array.isArray(data[1])) {
      return data[1];
    }
    return [];
  } catch {
    return [];
  }
}

async function generateKeywordTree({ keyword, language = 'it', country = 'it', strategy = 'all' }) {
  const baseKeyword = keyword.trim();
  const results = {
    keyword: baseKeyword,
    language,
    country,
    totalSuggestions: 0,
    clusters: {
      questions: [],
      commercialAndComparison: [],
      alphabetical: []
    }
  };

  const seen = new Set();
  const addUnique = (list, items) => {
    for (const item of items) {
      const clean = String(item).trim().toLowerCase();
      if (clean && !seen.has(clean) && clean !== baseKeyword.toLowerCase()) {
        seen.add(clean);
        list.push(clean);
      }
    }
  };

  // Base suggestions
  const baseGoogle = await queryGoogleSuggest(baseKeyword, language, country);
  const baseBing = await queryBingSuggest(baseKeyword);
  addUnique(results.clusters.commercialAndComparison, [...baseGoogle, ...baseBing]);

  // Questions modifiers
  if (strategy === 'questions' || strategy === 'all') {
    const questionPrefixes = language === 'it' 
      ? ['come', 'perche', 'cosa e', 'quanto costa', 'dove trovare', 'quando', 'quale']
      : ['how to', 'why', 'what is', 'how much', 'where to', 'when', 'which'];

    for (const q of questionPrefixes) {
      const queries = await queryGoogleSuggest(`${q} ${baseKeyword}`, language, country);
      addUnique(results.clusters.questions, queries);
    }
  }

  // Commercial and comparison modifiers
  if (strategy === 'commercial' || strategy === 'all') {
    const commPrefixes = language === 'it'
      ? ['miglior', 'migliori', 'economico', 'gratis', 'online', 'alternative a', 'vs']
      : ['best', 'top', 'cheap', 'free', 'online', 'alternative to', 'vs'];

    for (const c of commPrefixes) {
      const queries = await queryGoogleSuggest(`${c} ${baseKeyword}`, language, country);
      addUnique(results.clusters.commercialAndComparison, queries);
    }
  }

  // Alphabetical expansion (a-z)
  if (strategy === 'alphabetical' || strategy === 'all') {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const lettersToTest = strategy === 'all' ? alphabet.slice(0, 10) : alphabet;

    const promises = lettersToTest.map(letter => 
      queryGoogleSuggest(`${baseKeyword} ${letter}`, language, country)
    );
    const alphabetResults = await Promise.all(promises);
    for (const res of alphabetResults) {
      addUnique(results.clusters.alphabetical, res);
    }
  }

  results.totalSuggestions = seen.size;
  return results;
}

module.exports = {
  generateKeywordTree
};
