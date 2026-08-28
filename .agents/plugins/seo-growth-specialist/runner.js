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

let command = 'npx';
let args = [];

if (serverType === 'gsc') {
  args = ['-y', 'mcp-server-gsc'];
} else if (serverType === 'ga4') {
  if (creds.ga4_property_id) {
    env.GA4_PROPERTY_ID = String(creds.ga4_property_id);
  }
  args = ['-y', 'mcp-ga4'];
} else if (serverType === 'pagespeed') {
  if (creds.google_api_key) {
    env.GOOGLE_API_KEY = String(creds.google_api_key);
  }
  args = ['-y', 'pagespeed-insights-mcp'];
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
