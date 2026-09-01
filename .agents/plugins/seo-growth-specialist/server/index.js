#!/usr/bin/env node
/**
 * SEO & Growth Specialist - Master MCP Server
 * Fast, Native, Zero-Dependency Multi-Tool MCP Server (JSON-RPC 2.0 Stdio)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Import submodules
const { generateKeywordTree } = require('./tools/suggest');
const { generateKey, submitUrls } = require('./tools/indexnow');
const { auditPageTechnical, crawlSiteSitemap } = require('./tools/crawler');
const { validateJsonLdSchema } = require('./tools/schema');
const { inspectLiveSerp, analyzeCompetitorContent } = require('./tools/serp');
const { validateLlmsTxt, testAiBrandCitation } = require('./tools/geo');
const { searchCommunityDiscussions } = require('./tools/community');

// Read credentials if present (for optional keys)
const credPath = path.resolve(__dirname, '../credentials.json');
let creds = {};
if (fs.existsSync(credPath)) {
  try {
    creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
  } catch {}
}

const TOOLS_DEFINITIONS = [
  {
    name: 'google_suggest_keyword_tree',
    description: 'Generates a deep keyword intent tree using Google and Bing Suggest endpoints with alphabetical and question expansions (100% Free, Zero API Keys).',
    inputSchema: {
      type: 'object',
      properties: {
        keyword: { type: 'string', description: 'Base keyword or search seed (e.g. "software crm", "hotel milano")' },
        language: { type: 'string', description: 'Language code (e.g. "it", "en", "es", "de", "fr")', default: 'it' },
        country: { type: 'string', description: 'Country code (e.g. "it", "us", "uk", "de", "fr")', default: 'it' },
        strategy: { 
          type: 'string', 
          enum: ['all', 'questions', 'commercial', 'alphabetical'], 
          description: 'Expansion strategy: "all" (recommended), "questions" (how/why/what), "commercial" (best/vs/cheap), "alphabetical" (a-z)', 
          default: 'all' 
        }
      },
      required: ['keyword']
    }
  },
  {
    name: 'crawl_site_sitemap',
    description: 'Crawls URLs from a sitemap.xml checking HTTP status codes (200, 301, 404, 500), response times, and broken links.',
    inputSchema: {
      type: 'object',
      properties: {
        sitemapUrl: { type: 'string', description: 'Full URL to sitemap.xml (e.g. "https://example.com/sitemap.xml")' },
        maxUrls: { type: 'number', description: 'Maximum number of URLs to check (default: 30, max: 100)', default: 30 }
      },
      required: ['sitemapUrl']
    }
  },
  {
    name: 'audit_page_technical',
    description: 'Performs a fast, in-depth technical on-page SEO audit for a live URL (title, meta description, canonical, robots, H1-H3 hierarchy, missing alt tags, OpenGraph, JSON-LD schemas).',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Full URL of the page to inspect (e.g. "https://example.com/landing-page")' }
      },
      required: ['url']
    }
  },
  {
    name: 'validate_jsonld_schema',
    description: 'Validates JSON-LD structured data (FAQPage, Product, LocalBusiness, Article, HowTo, BreadcrumbList, SoftwareApplication) checking syntax, mandatory properties, and rich snippet eligibility.',
    inputSchema: {
      type: 'object',
      properties: {
        jsonLdContent: { 
          description: 'JSON string, script block, or object representing the Schema.org JSON-LD structured data to validate' 
        }
      },
      required: ['jsonLdContent']
    }
  },
  {
    name: 'indexnow_submit_urls',
    description: 'Submits a batch of URLs to the IndexNow protocol (instant notification to Bing, Yandex, Seznam, and AI search bots).',
    inputSchema: {
      type: 'object',
      properties: {
        host: { type: 'string', description: 'Domain host (e.g. "example.com")' },
        urlList: { 
          type: 'array', 
          items: { type: 'string' }, 
          description: 'Array of full URLs to submit for instant indexation' 
        },
        key: { type: 'string', description: 'IndexNow key string. If omitted, uses indexnow_key from credentials.json' },
        keyLocation: { type: 'string', description: 'Optional custom URL location of the verification key file' }
      },
      required: ['host', 'urlList']
    }
  },
  {
    name: 'indexnow_generate_key',
    description: 'Generates a secure IndexNow API key and outputs the verification text file name and instructions.',
    inputSchema: {
      type: 'object',
      properties: {
        host: { type: 'string', description: 'Domain host (e.g. "example.com")' }
      },
      required: ['host']
    }
  },
  {
    name: 'inspect_live_serp',
    description: 'Fetches live Google SERP rankings, People Also Ask (PAA) questions, and competitor results (uses optional Serper.dev key if available in credentials.json).',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query to inspect' },
        country: { type: 'string', description: 'Country code (e.g. "it", "us")', default: 'it' },
        numResults: { type: 'number', description: 'Number of organic results to extract (default: 10)', default: 10 }
      },
      required: ['query']
    }
  },
  {
    name: 'analyze_competitor_content',
    description: 'Scrapes and analyzes a competitor page: headings outline (H1-H3), word count, reading time, frequent n-gram phrases, and structured data schemas.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Full URL of the competitor page to analyze' }
      },
      required: ['url']
    }
  },
  {
    name: 'validate_llms_txt',
    description: 'Validates and scores an llms.txt or llms-full.txt file for Generative Engine Optimization (GEO) compliance and LLM crawlers.',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Raw markdown content of llms.txt' },
        url: { type: 'string', description: 'URL of the remote llms.txt to fetch and audit (e.g. "https://example.com/llms.txt")' }
      }
    }
  },
  {
    name: 'test_ai_brand_citation',
    description: 'Benchmarks brand visibility and citations on AI search engines (Perplexity / Gemini) for targeted intent queries.',
    inputSchema: {
      type: 'object',
      properties: {
        brandName: { type: 'string', description: 'Brand or product name to check citations for' },
        domain: { type: 'string', description: 'Domain name (e.g. "mywebsite.com")' },
        queries: { 
          type: 'array', 
          items: { type: 'string' }, 
          description: 'Array of high-intent search questions to test (e.g. ["miglior tool per X", "alternative a Y"])' 
        }
      },
      required: ['brandName', 'queries']
    }
  },
  {
    name: 'search_community_discussions',
    description: 'Searches public Reddit and Hacker News discussions for user questions and pain points to find zero-budget organic growth and distribution opportunities.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Topic or problem keyword (e.g. "best invoice tool", "nextjs seo problem")' },
        platform: { type: 'string', enum: ['all', 'reddit', 'hackernews'], default: 'all' },
        limit: { type: 'number', description: 'Max discussions per platform (default: 10)', default: 10 }
      },
      required: ['query']
    }
  }
];

async function handleToolCall(name, args) {
  switch (name) {
    case 'google_suggest_keyword_tree':
      return await generateKeywordTree(args);

    case 'crawl_site_sitemap':
      return await crawlSiteSitemap(args);

    case 'audit_page_technical':
      return await auditPageTechnical(args);

    case 'validate_jsonld_schema':
      return validateJsonLdSchema(args);

    case 'indexnow_submit_urls':
      return await submitUrls({
        ...args,
        key: args.key || creds.indexnow_key
      });

    case 'indexnow_generate_key':
      return generateKey(args.host);

    case 'inspect_live_serp':
      return await inspectLiveSerp({
        ...args,
        serperApiKey: creds.serper_api_key || process.env.SERPER_API_KEY
      });

    case 'analyze_competitor_content':
      return await analyzeCompetitorContent(args);

    case 'validate_llms_txt':
      return await validateLlmsTxt(args);

    case 'test_ai_brand_citation':
      return await testAiBrandCitation({
        ...args,
        perplexityApiKey: creds.perplexity_api_key || process.env.PERPLEXITY_API_KEY,
        geminiApiKey: creds.google_api_key || process.env.GOOGLE_API_KEY
      });

    case 'search_community_discussions':
      return await searchCommunityDiscussions(args);

    default:
      throw new Error(`Unknown tool name: ${name}`);
  }
}

function sendResponse(response) {
  process.stdout.write(JSON.stringify(response) + '\n');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  try {
    const message = JSON.parse(trimmed);

    // Initialize Request
    if (message.method === 'initialize') {
      sendResponse({
        jsonrpc: '2.0',
        id: message.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'seo-growth-suite',
            version: '1.0.0'
          }
        }
      });
      return;
    }

    // Initialized Notification
    if (message.method === 'notifications/initialized') {
      return; // No response required
    }

    // Ping
    if (message.method === 'ping') {
      sendResponse({
        jsonrpc: '2.0',
        id: message.id,
        result: {}
      });
      return;
    }

    // List Tools
    if (message.method === 'tools/list') {
      sendResponse({
        jsonrpc: '2.0',
        id: message.id,
        result: {
          tools: TOOLS_DEFINITIONS
        }
      });
      return;
    }

    // Call Tool
    if (message.method === 'tools/call') {
      const { name, arguments: toolArgs } = message.params || {};
      try {
        const result = await handleToolCall(name, toolArgs || {});
        sendResponse({
          jsonrpc: '2.0',
          id: message.id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          }
        });
      } catch (toolError) {
        sendResponse({
          jsonrpc: '2.0',
          id: message.id,
          result: {
            isError: true,
            content: [
              {
                type: 'text',
                text: `Errore durante l'esecuzione del tool "${name}": ${toolError.message}`
              }
            ]
          }
        });
      }
      return;
    }

    // Unhandled method
    if (message.id !== undefined) {
      sendResponse({
        jsonrpc: '2.0',
        id: message.id,
        error: {
          code: -32601,
          message: `Method "${message.method}" not found`
        }
      });
    }
  } catch (err) {
    // JSON parse error
  }
});
