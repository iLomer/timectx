'use strict';

const fs = require('fs');
const path = require('path');

const MCP_COMMAND = 'npx';
const MCP_ARGS = ['-y', 'timectx', 'mcp'];

function patchConfig(config) {
  const base = config !== null && typeof config === 'object' ? config : {};

  // clean up old dead keys from 0.1.x
  const cleaned = Object.assign({}, base);
  delete cleaned.currentDate;
  delete cleaned.currentDateTime;

  const existing = cleaned.mcpServers || {};
  const entry = existing.timectx;
  const alreadyRegistered = entry &&
    entry.command === MCP_COMMAND &&
    JSON.stringify(entry.args) === JSON.stringify(MCP_ARGS);

  if (alreadyRegistered) {
    return { config: cleaned, status: 'unchanged' };
  }

  const updated = Object.assign({}, cleaned, {
    mcpServers: Object.assign({}, existing, {
      timectx: { command: MCP_COMMAND, args: MCP_ARGS }
    })
  });

  return { config: updated, status: 'timectx' in existing ? 'updated' : 'injected' };
}

function writeConfig(filePath, config) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });

  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(config, null, 2), 'utf8');
  fs.renameSync(tmpPath, filePath);
}

module.exports = { patchConfig, writeConfig };
