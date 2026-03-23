'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const MARKER_START = '<!-- timectx:start -->';
const MARKER_END = '<!-- timectx:end -->';

function getClaudeCodeMdPath() {
  return path.join(os.homedir(), '.claude', 'CLAUDE.md');
}

function buildBlock() {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0];
  return `${MARKER_START}\nCurrent date and time: ${date} ${time}\n${MARKER_END}`;
}

function patchClaudeCode() {
  const filePath = getClaudeCodeMdPath();
  const block = buildBlock();

  let existing = '';
  if (fs.existsSync(filePath)) {
    existing = fs.readFileSync(filePath, 'utf8');
  }

  const startIdx = existing.indexOf(MARKER_START);
  const endIdx = existing.indexOf(MARKER_END);

  let updated;
  let status;

  if (startIdx !== -1 && endIdx !== -1) {
    updated = existing.slice(0, startIdx) + block + existing.slice(endIdx + MARKER_END.length);
    status = 'updated';
  } else {
    updated = block + (existing ? '\n\n' + existing : '');
    status = 'injected';
  }

  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, updated, 'utf8');

  return { filePath, status };
}

module.exports = { patchClaudeCode };
