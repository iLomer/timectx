'use strict';

const fs = require('fs');
const path = require('path');

const DATE_PREFIX = "Today's date is ";
const DATE_SUFFIX = '.';

function currentDateString() {
  return new Date().toISOString().split('T')[0];
}

function buildDateValue(dateStr) {
  return `${DATE_PREFIX}${dateStr}${DATE_SUFFIX}`;
}

function patchConfig(config) {
  const dateStr = currentDateString();
  const dateValue = buildDateValue(dateStr);
  const base = config !== null && typeof config === 'object' ? config : {};

  if ('currentDate' in base) {
    if (base.currentDate === dateValue) {
      return { config: Object.assign({}, base), status: 'unchanged' };
    }
    return { config: Object.assign({}, base, { currentDate: dateValue }), status: 'updated' };
  }

  return { config: Object.assign({}, base, { currentDate: dateValue }), status: 'injected' };
}

function writeConfig(filePath, config) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });

  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(config, null, 2), 'utf8');
  fs.renameSync(tmpPath, filePath);
}

module.exports = { patchConfig, writeConfig };
