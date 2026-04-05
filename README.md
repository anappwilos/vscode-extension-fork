# Fork (VS Code Extension)

A lightweight extension to open your current workspace repository directly in the [Fork](https://fork.dev/) desktop app.

## Features

- Adds the command `Fork: open current git repository in Fork`.
- Detects the active file workspace folder first.
- Falls back to the first workspace folder when no editor is active.

## 2026 refresh

This repository has been updated for modern VS Code extension development:

- Manifest compatibility updated to current VS Code API ranges.
- Metadata and command text polished for marketplace clarity.
- Project docs refreshed to match the real source layout (`src/index.ts`).

## Usage

1. Open a project folder in VS Code.
2. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
3. Run `Fork: open current git repository in Fork`.

## Development

```bash
pnpm install
pnpm build
pnpm lint
```

## Links

- Issues: https://github.com/imyangyong/vscode-extension-fork/issues
