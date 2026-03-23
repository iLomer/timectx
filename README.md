# timectx

Fixes Claude's most annoying limitation: it has no idea what time it is.

```
npx timectx install
```

That's it. Detects your Claude Desktop config, injects today's date. No JSON editing, no technical knowledge needed.

## What it does

Adds a `currentDate` entry to your Claude Desktop config so Claude always knows what day it is. No more "best practices 2024" when you're in 2026.

## Supported platforms

- macOS
- Windows
- Linux

## Requirements

- Node.js 16+
- [Claude Desktop](https://claude.ai/download) installed

## Usage

```bash
npx timectx install
```

Re-run anytime to update the date (e.g. add it to a login script).

## License

MIT
