'use strict';

const os = require('os');
const path = require('path');

function detectConfigPath(platform) {
  const resolvedPlatform = platform || process.platform;

  if (resolvedPlatform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  }

  if (resolvedPlatform === 'win32') {
    const appData = process.env.APPDATA;
    if (!appData) {
      throw new Error('APPDATA environment variable is not set');
    }
    return path.join(appData, 'Claude', 'claude_desktop_config.json');
  }

  if (resolvedPlatform === 'linux') {
    return path.join(os.homedir(), '.config', 'Claude', 'claude_desktop_config.json');
  }

  throw new Error(`Unsupported OS: ${resolvedPlatform}`);
}

module.exports = { detectConfigPath };
