# timectx

Claude has no idea what time it is. One command fixes that.

```
npx timectx install
```

Patches **Claude Desktop** and **Claude Code** automatically. No config editing, no setup.

For **claude.ai** in the browser — install the [Chrome extension](https://github.com/iLomer/timectx/tree/main/extension).

Claude has no internal clock. It gets the date once at session start
and never updates it. Long sessions drift. New chats sometimes get
the wrong timezone. And if you ever mention you're tired, it becomes
your mom for the rest of the week.

This fixes it.

## After install

- **Claude Desktop** — restart the app once, then it's live
- **Claude Code** — works immediately
- **claude.ai (browser)** — install the Chrome extension, done

## Requirements

- Node.js 16+

## License

MIT
