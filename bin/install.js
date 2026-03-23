#!/usr/bin/env node

'use strict';

const { detectConfigPath } = require('../src/detect-config-path.js');
const { readConfig } = require('../src/read-config.js');
const { patchConfig, writeConfig } = require('../src/patch-config.js');

const command = process.argv[2];

if (command !== 'install') {
  process.stderr.write('Usage: timectx install\n');
  process.exit(1);
}

process.stdout.write('timectx \u2014 injecting currentDate into Claude config...\n');

try {
  const configPath = detectConfigPath();
  const existing = readConfig(configPath);
  const { config, status } = patchConfig(existing);

  if (status === 'unchanged') {
    process.stdout.write(`Already up to date. No changes made to ${configPath}\n`);
    process.exit(0);
  }

  writeConfig(configPath, config);

  if (status === 'injected') {
    process.stdout.write(`Done. currentDate injected into ${configPath}\n`);
  } else {
    process.stdout.write(`Done. currentDate updated in ${configPath}\n`);
  }

  process.exit(0);
} catch (err) {
  process.stderr.write(`Error: ${err.message}\n`);
  process.exit(1);
}
