'use strict';

// Inject into page context so we can intercept fetch before claude.ai's code runs
const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
document.documentElement.appendChild(script);
script.remove();
