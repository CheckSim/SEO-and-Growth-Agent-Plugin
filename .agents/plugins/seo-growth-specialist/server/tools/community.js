/**
 * Community Intent & Zero-Budget Organic Distribution Engine
 * Public Reddit & Hacker News search for intent-driven community engagement
 */

const https = require('https');

function fetchJson(url, customHeaders = {}) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ...customHeaders
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ data: JSON.parse(data), statusCode: res.statusCode });
        } catch (e) {
          resolve({ error: e.message, statusCode: res.statusCode });
        }
      });
    });
    req.on('error', err => resolve({ error: err.message, statusCode: 0 }));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ error: 'Timeout', statusCode: 0 });
    });
  });
}

async function searchReddit(query, limit = 10) {
  const url = `https://old.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&limit=${limit}`;
  const res = await fetchJson(url, {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/json'
  });
  if (!res.data || !res.data.data || !Array.isArray(res.data.data.children)) {
    return [];
  }
  return res.data.data.children.map(c => ({
    platform: 'Reddit',
    subreddit: `r/${c.data.subreddit}`,
    title: c.data.title,
    author: c.data.author,
    upvotes: c.data.score,
    commentsCount: c.data.num_comments,
    url: `https://www.reddit.com${c.data.permalink}`,
    snippet: (c.data.selftext || '').slice(0, 200).replace(/\n+/g, ' ')
  }));
}

async function searchHackerNews(query, limit = 10) {
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&hitsPerPage=${limit}`;
  const res = await fetchJson(url);
  if (!res.data || !Array.isArray(res.data.hits)) {
    return [];
  }
  return res.data.hits.map(h => ({
    platform: 'Hacker News',
    title: h.title || h.story_title || 'Discussione HN',
    author: h.author,
    upvotes: h.points || 0,
    commentsCount: h.num_comments || 0,
    url: `https://news.ycombinator.com/item?id=${h.objectID}`,
    externalUrl: h.url || null,
    snippet: (h.comment_text || '').replace(/<[^>]+>/g, '').slice(0, 200) || `Pubblicato da ${h.author} con ${h.points || 0} punti e ${h.num_comments || 0} commenti.`
  }));
}

async function searchCommunityDiscussions({ query, platform = 'all', limit = 10 }) {
  const discussions = [];

  if (platform === 'reddit' || platform === 'all') {
    const redditResults = await searchReddit(query, limit);
    discussions.push(...redditResults);
  }

  if (platform === 'hackernews' || platform === 'all') {
    const hnResults = await searchHackerNews(query, limit);
    discussions.push(...hnResults);
  }

  // Sort by engagement (commentsCount + upvotes)
  discussions.sort((a, b) => ((b.upvotes || 0) + (b.commentsCount || 0)) - ((a.upvotes || 0) + (a.commentsCount || 0)));

  return {
    query,
    totalDiscussionsFound: discussions.length,
    discussions: discussions.slice(0, limit * 2),
    guidance: 'Usa questi thread per rispondere a utenti che hanno un problema specifico risolto dalla tua guida o prodotto, fornendo valore reale e citando il tuo link in modo contestuale ed etico.'
  };
}

module.exports = {
  searchCommunityDiscussions
};
