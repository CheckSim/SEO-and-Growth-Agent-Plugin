#!/usr/bin/env node

/**
 * Setup del Plugin SEO & Growth Specialist per Google Antigravity
 * 
 * 1. Verifica che mcp_config.json interno al plugin sia configurato per Antigravity.
 * 2. Inizializza credentials.json da credentials.example.json se non presente.
 * 3. Assicura i permessi di esecuzione a runner.js.
 * 4. Pulisce eventuali configurazioni legacy duplicate generate da vecchie versioni.
 * 5. Esegue la test suite di integrità.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

console.log('🚀 Avvio configurazione SEO & Growth Specialist...\n');

// 1. Individuazione della cartella del plugin
let pluginDir = __dirname;
if (!fs.existsSync(path.resolve(pluginDir, 'runner.js'))) {
  if (fs.existsSync(path.resolve(__dirname, '.agents/plugins/seo-growth-specialist/runner.js'))) {
    pluginDir = path.resolve(__dirname, '.agents/plugins/seo-growth-specialist');
  } else {
    console.error('❌ Impossibile trovare runner.js del plugin.');
    process.exit(1);
  }
}

const RUNNER_FILE = path.resolve(pluginDir, 'runner.js');
console.log(`📍 Cartella Plugin: ${pluginDir}`);

// 2. Verifica / Scrittura mcp_config.json interno (100% self-contained)
const pluginMcpConfig = path.resolve(pluginDir, 'mcp_config.json');
const selfContainedConfig = {
  mcpServers: {
    'google-search-console': { command: 'node', args: ['./runner.js', 'gsc'] },
    'google-analytics': { command: 'node', args: ['./runner.js', 'ga4'] },
    'pagespeed-insights': { command: 'node', args: ['./runner.js', 'pagespeed'] },
    'seo-growth-tools': { command: 'node', args: ['./runner.js', 'tools'] }
  }
};
fs.writeFileSync(pluginMcpConfig, JSON.stringify(selfContainedConfig, null, 2) + '\n', 'utf8');
console.log('✅ Configurazione MCP interna al plugin verificata.');

// 3. Pulizia retrocompatibile di .agents/mcp_config.json (se presente nella root)
// Evita che Antigravity lanci server duplicati (8 processi invece di 4)
const possibleRootConfig = path.resolve(pluginDir, '../../../.agents/mcp_config.json');
const localRootConfig = path.resolve(__dirname, '.agents/mcp_config.json');
const targetConfigs = Array.from(new Set([possibleRootConfig, localRootConfig]));

for (const cfgPath of targetConfigs) {
  if (fs.existsSync(cfgPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      if (data.mcpServers) {
        const legacyKeys = ['google-search-console', 'google-analytics', 'pagespeed-insights', 'seo-growth-tools'];
        let changed = false;
        for (const k of legacyKeys) {
          if (data.mcpServers[k] && data.mcpServers[k].args && data.mcpServers[k].args.some(a => String(a).includes('seo-growth-specialist'))) {
            delete data.mcpServers[k];
            changed = true;
          }
        }
        if (changed) {
          if (Object.keys(data.mcpServers).length === 0) {
            fs.unlinkSync(cfgPath);
            console.log(`🧹 Rimosso file legacy ${cfgPath} (evita server duplicati).`);
          } else {
            fs.writeFileSync(cfgPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
            console.log(`🧹 Rimosse voci duplicate da ${cfgPath} (preservati altri server terzi).`);
          }
        }
      }
    } catch {}
  }
}

// 4. Inizializzazione credentials.json
const credPath = path.resolve(pluginDir, 'credentials.json');
const credExamplePath = path.resolve(pluginDir, 'credentials.example.json');

if (fs.existsSync(credPath)) {
  console.log('✅ File credenziali credentials.json presente.');
} else if (fs.existsSync(credExamplePath)) {
  fs.copyFileSync(credExamplePath, credPath);
  console.log('⚠️  Creato credentials.json dal template credentials.example.json.');
  console.log(`   👉 Incolla le tue chiavi Google Cloud in:\n   ${credPath}`);
}

// 5. Permessi eseguibile
try {
  fs.chmodSync(RUNNER_FILE, 0o755);
} catch {}

// 6. Test Suite automatizzata
console.log('\n🧪 Esecuzione test di integrità del plugin...');
const testResult = spawnSync('node', [path.resolve(pluginDir, 'test/suite.test.js')], {
  stdio: 'inherit',
  cwd: pluginDir
});

if (testResult.status === 0) {
  console.log('\n🎉 Setup completato con successo! Il plugin è pronto all\'uso.');
  console.log('👉 Ricarica la finestra IDE (Cmd + Shift + P -> "Developer: Reload Window").');
} else {
  console.error('\n❌ Alcuni test di integrità sono falliti.');
  process.exit(1);
}
