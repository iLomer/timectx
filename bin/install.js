#!/usr/bin/env node
'use strict';

const path = require('path');
const { detectConfigPath } = require('../src/detect-config-path.js');
const { readConfig } = require('../src/read-config.js');
const { patchConfig, writeConfig } = require('../src/patch-config.js');
const { patchClaudeCode } = require('../src/patch-claude-code.js');

const command = process.argv[2];

if (command !== 'install') {
  process.stderr.write('Usage: timectx install\n');
  process.exit(1);
}

const mcpServerPath = path.resolve(__dirname, '../src/mcp-server.js');

process.stdout.write('timectx — patching Claude surfaces...\n\n');

let anyError = false;

// Claude Desktop
try {
  const configPath = detectConfigPath();
  const existing = readConfig(configPath);
  const { config, status } = patchConfig(existing, mcpServerPath);

  if (status === 'unchanged') {
    process.stdout.write(`  Claude Desktop  already up to date\n`);
  } else {
    writeConfig(configPath, config);
    process.stdout.write(`  Claude Desktop  MCP server ${status} → restart Claude Desktop to apply\n`);
  }
} catch (err) {
  process.stdout.write(`  Claude Desktop  skipped (${err.message})\n`);
}

// Claude Code
try {
  const { filePath, status } = patchClaudeCode();
  process.stdout.write(`  Claude Code     datetime ${status} into ${filePath}\n`);
} catch (err) {
  process.stdout.write(`  Claude Code     skipped (${err.message})\n`);
  anyError = true;
}

process.stdout.write('\nDone.\n');
process.exit(anyError ? 1 : 0);
