#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const credPath = path.resolve(__dirname, 'credentials.json');
let creds = {};

if (fs.existsSync(credPath)) {
  try {
    creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
  } catch (err) {
    console.error('[runner] Error reading credentials.json:', err.message);
  }
} else {
  console.error('[runner] File credentials.json not found at:', credPath);
}

const serverType = process.argv[2];
const env = { ...process.env, GOOGLE_APPLICATION_CREDENTIALS: credPath };

if (creds.indexnow_key) env.INDEXNOW_KEY = String(creds.indexnow_key);
if (creds.serper_api_key) env.SERPER_API_KEY = String(creds.serper_api_key);
if (creds.perplexity_api_key) env.PERPLEXITY_API_KEY = String(creds.perplexity_api_key);

// Funzione di risoluzione comando (privilegia node_modules locali, fallback su npx)
function resolveMcpCommand(packageName) {
  const localBin = path.resolve(__dirname, 'node_modules/.bin', packageName);
  if (fs.existsSync(localBin)) {
    return { command: localBin, args: [] };
  }
  return { command: 'npx', args: ['-y', packageName] };
}

let command = 'npx';
let args = [];

if (serverType === 'gsc') {
  const resolved = resolveMcpCommand('mcp-server-gsc');
  command = resolved.command;
  args = resolved.args;
} else if (serverType === 'ga4') {
  if (creds.ga4_property_id) {
    env.GA4_PROPERTY_ID = String(creds.ga4_property_id);
  }
  const resolved = resolveMcpCommand('mcp-ga4');
  command = resolved.command;
  args = resolved.args;
} else if (serverType === 'pagespeed') {
  if (creds.google_api_key) {
    env.GOOGLE_API_KEY = String(creds.google_api_key);
  }
  const resolved = resolveMcpCommand('pagespeed-insights-mcp');
  command = resolved.command;
  args = resolved.args;
} else if (serverType === 'tools') {
  command = 'node';
  args = [path.resolve(__dirname, 'server/index.js')];
} else {
  console.error('[runner] Unknown server type:', serverType);
  process.exit(1);
}

const child = spawn(command, args, {
  stdio: 'inherit',
  env,
  shell: process.platform === 'win32'
});

child.on('exit', (code, signal) => {
  if (code !== null) process.exit(code);
  if (signal) process.kill(process.pid, signal);
});
