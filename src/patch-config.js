'use strict';

const fs = require('fs');
const path = require('path');

function patchConfig(config, mcpServerPath) {
  const base = config !== null && typeof config === 'object' ? config : {};

  // clean up old dead key from 0.1.x
  const cleaned = Object.assign({}, base);
  delete cleaned.currentDate;
  delete cleaned.currentDateTime;

  const existing = cleaned.mcpServers || {};
  const alreadyRegistered = existing.timectx &&
    existing.timectx.args &&
    existing.timectx.args[0] === mcpServerPath;

  if (alreadyRegistered) {
    return { config: cleaned, status: 'unchanged' };
  }

  const updated = Object.assign({}, cleaned, {
    mcpServers: Object.assign({}, existing, {
      timectx: { command: 'node', args: [mcpServerPath] }
    })
  });

  return { config: updated, status: Object.keys(existing).includes('timectx') ? 'updated' : 'injected' };
}

function writeConfig(filePath, config) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });

  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(config, null, 2), 'utf8');
  fs.renameSync(tmpPath, filePath);
}

module.exports = { patchConfig, writeConfig };
