# Fork (VS Code Extension)

A lightweight extension to open your current workspace repository directly in the [Fork](https://fork.dev/) desktop app.

## Features

- Adds the command `Fork: open current git repository in Fork`.
- Uses the active editor workspace folder first, then falls back to the first open workspace folder.
- Validates that the selected folder is a Git repository before opening.
- Uses safe process execution (`execFile`) to launch Fork.
- Supports a configurable executable path via `fork.executablePath`.

## Configuration

### `fork.executablePath`

Set the full path to the Fork executable in VS Code settings.

```json
{
  "fork.executablePath": ""
}
```

- If empty on **macOS**, the extension uses `open -a Fork`.
- On **Windows/Linux**, set this path explicitly.

Examples:

- macOS app binary:
  - `/Applications/Fork.app/Contents/MacOS/Fork`
- Windows:
  - `C:\\Users\\<you>\\AppData\\Local\\Fork\\Fork.exe`
- Linux (if installed via custom path):
  - `/opt/Fork/fork`

## 2026 refresh

This repository has been updated for modern VS Code extension development:

- Manifest compatibility updated to current VS Code API ranges.
- Metadata and command text polished for marketplace clarity.
- Project docs refreshed to match the real source layout (`src/index.ts`).
- Command implementation hardened with repository validation and clearer errors.

## Usage

1. Open a Git repository folder in VS Code.
2. (Windows/Linux) Configure `fork.executablePath`.
3. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
4. Run `Fork: open current git repository in Fork`.

## Development

```bash
npm install
npm run build
npm run lint
npm run antigravity
```

## VS Code launch profiles

This repository now includes `.vscode/launch.json` with:

- `Run Fork Extension (VS Code)` to start an Extension Development Host.
- `Run Antigravity Playground` to run `playground/index.js`.
- `Run VS Code + Antigravity` compound to launch both together.


## Links

- Issues: https://github.com/imyangyong/vscode-extension-fork/issues
