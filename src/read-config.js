'use strict';

const fs = require('fs');

function readConfig(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf8');

  try {
    return JSON.parse(raw);
  } catch (_err) {
    throw new Error(`Config file is not valid JSON: ${filePath}`);
  }
}

module.exports = { readConfig };
