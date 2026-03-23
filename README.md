# timectx

Fixes Claude's most annoying limitation: it has no idea what time it is.

```
npx timectx install
```

That's it. Detects your Claude Desktop config, injects the current date and time. No JSON editing, no technical knowledge needed.

## What it does

Adds a `currentDateTime` entry to your Claude Desktop config so Claude always knows the date and time. No more "best practices 2024" when you're in 2026. No more being told to go to sleep at 2pm.

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

Re-run anytime to update the date and time (e.g. add it to a login script).

## License

MIT
