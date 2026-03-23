'use strict';

const fs = require('fs');
const path = require('path');

const KEY = 'currentDateTime';

function currentDateTimeString() {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0]; // HH:MM:SS
  return `Today's date and time is ${date} ${time}.`;
}

function patchConfig(config) {
  const dateValue = currentDateTimeString();
  const base = config !== null && typeof config === 'object' ? config : {};

  // migrate old key if present
  const hasOldKey = 'currentDate' in base;
  const hasKey = KEY in base;

  if (!hasOldKey && hasKey && base[KEY] === dateValue) {
    return { config: Object.assign({}, base), status: 'unchanged' };
  }

  const updated = Object.assign({}, base, { [KEY]: dateValue });
  if (hasOldKey) delete updated.currentDate;

  return { config: updated, status: hasKey || hasOldKey ? 'updated' : 'injected' };
}

function writeConfig(filePath, config) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });

  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(config, null, 2), 'utf8');
  fs.renameSync(tmpPath, filePath);
}

module.exports = { patchConfig, writeConfig };
