/**
 * Automated Unit Test Suite for All-in-One SEO & Growth Suite
 */

const assert = require('assert');
const { spawn } = require('child_process');
const path = require('path');

const { generateKeywordTree } = require('../server/tools/suggest');
const { generateKey } = require('../server/tools/indexnow');
const { validateJsonLdSchema } = require('../server/tools/schema');
const { validateLlmsTxt } = require('../server/tools/geo');

async function runTests() {
  console.log('🧪 Avvio Test Suite SEO & Growth Specialist...\n');

  // Test 1: Suggest Engine
  console.log('1. Test Google/Bing Suggest Engine...');
  const suggestRes = await generateKeywordTree({ keyword: 'crm', language: 'it', country: 'it', strategy: 'commercial' });
  assert(suggestRes.keyword === 'crm', 'Keyword must match');
  assert(Array.isArray(suggestRes.clusters.commercialAndComparison), 'Must have commercial cluster array');
  assert(suggestRes.totalSuggestions > 0, 'Must return suggestions');
  console.log(`   ✅ OK: ${suggestRes.totalSuggestions} suggerimenti estratti con successo.`);

  // Test 2: IndexNow Key Generator
  console.log('2. Test IndexNow Key Generator...');
  const keyRes = generateKey('example.com');
  assert(keyRes.key.length === 32, 'Key length must be 32 hex chars');
  assert(keyRes.fileName === `${keyRes.key}.txt`, 'Filename must match key.txt');
  assert(keyRes.verificationUrl === `https://example.com/${keyRes.key}.txt`, 'Verification URL correct');
  console.log(`   ✅ OK: Chiave IndexNow generata: ${keyRes.key}`);

  // Test 3: Schema.org JSON-LD Validator
  console.log('3. Test Schema.org Validator...');
  
  // Valid FAQ
  const validFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [{
      '@type': 'Question',
      'name': 'Che cos\'è questo plugin?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'È un plugin autonomo per Google Antigravity.'
      }
    }]
  };
  const faqVal = validateJsonLdSchema({ jsonLdContent: validFaq });
  assert(faqVal.isValid === true, 'FAQPage must be valid');
  assert(faqVal.richSnippetEligible === true, 'Must be rich snippet eligible');

  // Invalid FAQ
  const invalidFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [{
      '@type': 'Question',
      'name': 'Domanda senza risposta'
    }]
  };
  const invalidVal = validateJsonLdSchema({ jsonLdContent: invalidFaq });
  assert(invalidVal.isValid === false, 'Must detect missing acceptedAnswer');
  assert(invalidVal.totalErrors > 0, 'Must report errors');
  console.log('   ✅ OK: Schema Validator rileva correttamente schemi validi ed errori di sintassi.');

  // Test 4: llms.txt Validator
  console.log('4. Test llms.txt Linter...');
  const validLlms = `# My Awesome Product\n\n> The best autonomous growth engine.\n\n## Core Services\n- [Documentation](https://example.com/docs): Official guides\n`;
  const llmsVal = await validateLlmsTxt({ content: validLlms });
  assert(llmsVal.valid === true, 'llms.txt must be valid');
  assert(llmsVal.score >= 80, 'Score must be high');

  const invalidLlms = `Some text without title or links`;
  const invalidLlmsVal = await validateLlmsTxt({ content: invalidLlms });
  assert(invalidLlmsVal.valid === false, 'Must flag missing H1');
  console.log('   ✅ OK: llms.txt Linter assegna punteggi e warning conformi.');

  // Test 5: MCP JSON-RPC Stdio Protocol
  console.log('5. Test Server MCP JSON-RPC over Stdio...');
  const serverProcess = spawn('node', [path.resolve(__dirname, '../server/index.js')], {
    stdio: ['pipe', 'pipe', 'inherit']
  });

  const sendRpc = (msg) => {
    serverProcess.stdin.write(JSON.stringify(msg) + '\n');
  };

  const rpcResponses = [];
  serverProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(l => l.trim());
    for (const l of lines) {
      try {
        rpcResponses.push(JSON.parse(l));
      } catch {}
    }
  });

  // Send initialize
  sendRpc({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
  await new Promise(r => setTimeout(r, 200));

  // Send tools/list
  sendRpc({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
  await new Promise(r => setTimeout(r, 200));

  // Send tools/call for validate_jsonld_schema
  sendRpc({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'validate_jsonld_schema',
      arguments: { jsonLdContent: validFaq }
    }
  });
  await new Promise(r => setTimeout(r, 300));

  serverProcess.kill();

  const initResp = rpcResponses.find(r => r.id === 1);
  const listResp = rpcResponses.find(r => r.id === 2);
  const callResp = rpcResponses.find(r => r.id === 3);

  assert(initResp && initResp.result.serverInfo.name === 'seo-growth-suite', 'Server info must match');
  assert(listResp && listResp.result.tools.length >= 10, 'Must expose at least 10 tools');
  assert(callResp && callResp.result.content[0].text.includes('Markup JSON-LD valido'), 'Call must succeed');

  console.log(`   ✅ OK: Protocollo MCP JSON-RPC 2.0 verificato (${listResp.result.tools.length} tool registrati).`);

  console.log('\n🎉 TUTTI I TEST UNITARI COMPLETATI CON SUCCESSO!\n');
}

runTests().catch(err => {
  console.error('❌ Test fallito:', err);
  process.exit(1);
});
