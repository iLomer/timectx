'use strict';

(function () {
  const originalFetch = window.fetch;

  function getDateTimeString() {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];
    return `${date} ${time}`;
  }

  function injectDateTime(body) {
    try {
      const parsed = JSON.parse(body);

      // claude.ai sends messages as an array — find the first human turn
      if (!parsed || !Array.isArray(parsed.messages)) return body;

      const datetime = getDateTimeString();
      const prefix = `[Current date and time: ${datetime}]\n\n`;
      let injected = false;

      parsed.messages = parsed.messages.map((msg) => {
        if (!injected && msg.role === 'human') {
          injected = true;
          if (typeof msg.content === 'string') {
            return { ...msg, content: prefix + msg.content };
          }
          if (Array.isArray(msg.content)) {
            const first = msg.content[0];
            if (first && first.type === 'text') {
              return {
                ...msg,
                content: [{ ...first, text: prefix + first.text }, ...msg.content.slice(1)]
              };
            }
          }
        }
        return msg;
      });

      return injected ? JSON.stringify(parsed) : body;
    } catch {
      return body;
    }
  }

  window.fetch = async function (url, options) {
    if (
      options &&
      options.method === 'POST' &&
      typeof options.body === 'string' &&
      typeof url === 'string' &&
      url.includes('claude.ai') &&
      (url.includes('/completion') || url.includes('/chat'))
    ) {
      options = { ...options, body: injectDateTime(options.body) };
    }
    return originalFetch.apply(this, arguments);
  };
})();
