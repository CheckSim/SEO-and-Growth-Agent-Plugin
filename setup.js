#!/usr/bin/env node

/**
 * Setup Automatico & Portabile per il Plugin SEO & Growth Specialist
 * 
 * Questo script:
 * 1. Rileva se il plugin è installato a livello Workspace (.agents) o Globale (~/.gemini/config).
 * 2. Risolve dinamicamente il percorso di runner.js (funziona sia dalla root che dalla cartella plugin).
 * 3. Esegue uno "Smart Merge" non distruttivo su mcp_config.json (preservando Supabase, Maps, ecc.).
 * 4. Verifica o inizializza credentials.json.
 * 5. Esegue il test suite di integrità.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

console.log('🚀 Avvio configurazione automatica SEO & Growth Specialist...\n');

// 0. Individuazione della cartella del plugin
let pluginDir = null;
if (fs.existsSync(path.resolve(__dirname, 'runner.js'))) {
  pluginDir = __dirname;
} else if (fs.existsSync(path.resolve(__dirname, '.agents/plugins/seo-growth-specialist/runner.js'))) {
  pluginDir = path.resolve(__dirname, '.agents/plugins/seo-growth-specialist');
} else {
  console.error('❌ Impossibile trovare runner.js del plugin.');
  process.exit(1);
}

const RUNNER_FILE = path.resolve(pluginDir, 'runner.js');

// 1. Rilevamento della modalità (Workspace vs Globale)
let isGlobal = false;
let targetConfigFile = null;
let runnerArg = RUNNER_FILE;

if (process.argv.includes('--global')) {
  isGlobal = true;
} else if (process.argv.includes('--workspace')) {
  isGlobal = false;
} else {
  const globalGeminiDir = path.resolve(os.homedir(), '.gemini/config');
  if (pluginDir.startsWith(globalGeminiDir)) {
    isGlobal = true;
  }
}

if (isGlobal) {
  const globalGeminiConfig = path.resolve(os.homedir(), '.gemini/config');
  if (!fs.existsSync(globalGeminiConfig)) {
    fs.mkdirSync(globalGeminiConfig, { recursive: true });
  }
  targetConfigFile = path.resolve(globalGeminiConfig, 'mcp_config.json');
  runnerArg = RUNNER_FILE;
  console.log(`📍 Modalità rilevata: GLOBALE (~/.gemini/config)`);
} else {
  let currentDir = pluginDir;
  let wsRoot = null;

  while (currentDir !== path.dirname(currentDir)) {
    const parent = path.dirname(currentDir);
    if (fs.existsSync(path.join(currentDir, '.git')) || fs.existsSync(path.join(currentDir, '.agents'))) {
      wsRoot = currentDir;
      break;
    }
    currentDir = parent;
  }

  if (!wsRoot) {
    wsRoot = path.resolve(pluginDir, '../../../');
  }

  const agentsDir = path.resolve(wsRoot, '.agents');
  if (!fs.existsSync(agentsDir)) {
    fs.mkdirSync(agentsDir, { recursive: true });
  }
  targetConfigFile = path.resolve(agentsDir, 'mcp_config.json');
  
  runnerArg = path.relative(wsRoot, RUNNER_FILE);
  console.log(`📍 Modalità rilevata: WORKSPACE (${wsRoot})`);
}

console.log(`🎯 File di configurazione target: ${targetConfigFile}`);
console.log(`⚙️  Puntamento runner: ${runnerArg}\n`);

// 2. Lettura e Smart-Merge di mcp_config.json
let currentConfig = { mcpServers: {} };

if (fs.existsSync(targetConfigFile)) {
  try {
    const raw = fs.readFileSync(targetConfigFile, 'utf8');
    if (raw.trim()) {
      currentConfig = JSON.parse(raw);
      if (!currentConfig.mcpServers) {
        currentConfig.mcpServers = {};
      }
    }
  } catch (err) {
    console.warn(`⚠️ Impossibile analizzare ${targetConfigFile}, verrà inizializzato nuovo config:`, err.message);
  }
}

const existingServerCount = Object.keys(currentConfig.mcpServers).length;

currentConfig.mcpServers['google-search-console'] = {
  command: 'node',
  args: [runnerArg, 'gsc']
};

currentConfig.mcpServers['google-analytics'] = {
  command: 'node',
  args: [runnerArg, 'ga4']
};

currentConfig.mcpServers['pagespeed-insights'] = {
  command: 'node',
  args: [runnerArg, 'pagespeed']
};

currentConfig.mcpServers['seo-growth-tools'] = {
  command: 'node',
  args: [runnerArg, 'tools']
};

fs.writeFileSync(targetConfigFile, JSON.stringify(currentConfig, null, 2) + '\n', 'utf8');
console.log(`✅ Smart-Merge completato: salvati ${Object.keys(currentConfig.mcpServers).length} server MCP (${existingServerCount} preesistenti conservati).`);

// 3. Verifica credenziali
const credPath = path.resolve(pluginDir, 'credentials.json');
const credExamplePath = path.resolve(pluginDir, 'credentials.example.json');

if (fs.existsSync(credPath)) {
  console.log(`✅ File credenziali 'credentials.json' trovato.`);
} else if (fs.existsSync(credExamplePath)) {
  fs.copyFileSync(credExamplePath, credPath);
  console.log(`⚠️  Creato 'credentials.json' dal template 'credentials.example.json'.`);
  console.log(`   👉 Incolla le tue chiavi Service Account Google Cloud, GA4 Property ID e Google API Key in:\n   ${credPath}`);
} else {
  console.log(`⚠️  Attenzione: 'credentials.json' non trovato. Assicurati di crearlo prima di usare i tool GSC/GA4/PageSpeed.`);
}

// 4. Assicura permessi di esecuzione a runner.js
try {
  fs.chmodSync(RUNNER_FILE, 0o755);
} catch {}

// 5. Test Suite di integrità
console.log('\n🧪 Esecuzione test di integrità del plugin...');
const testResult = spawnSync('node', [path.resolve(pluginDir, 'test/suite.test.js')], {
  stdio: 'inherit',
  cwd: pluginDir
});

if (testResult.status === 0) {
  console.log('🎉 Setup completato con successo!');
  console.log('\n👉 PROSSIMO PASSO: Ricarica la finestra IDE di Antigravity:');
  console.log('   Cmd + Shift + P -> "Developer: Reload Window"');
} else {
  console.error('\n❌ Alcuni test di integrità sono falliti. Verifica i messaggi sopra.');
  process.exit(1);
}
