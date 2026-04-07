# an-fork-quick-access

VS Code extension to open the current Git repository directly in the **Fork** desktop application.

## Current Platform Status (2026)

> **At the moment, this extension should be considered viable only on Windows.**

Reference research:

- Fork is presented as a Mac and Windows app on its official site: https://fork.dev/releasenotes
- A Windows distribution is available via winget (`Fork.Fork`): https://winget.run/pkg/Fork/Fork

## How Fork Is Resolved on Windows

Resolution order:

1. `fork.executablePath` (if you define it in VS Code)
2. `%LOCALAPPDATA%\Fork\Fork.exe`
3. `%ProgramFiles%\Fork\Fork.exe`
4. `%ProgramFiles(x86)%\Fork\Fork.exe`
5. `fork` command in `PATH`

If no executable is found, the extension shows an error and asks you to configure `fork.executablePath`.

When `fork.forceNewWindow=true`, the extension runs two actions in sequence:

1. Open a new Fork window (`fork.exe`).
2. Run `cmd /c start "" "fork.exe" "<repo-path>"` to open the repository in that new instance.

## Architecture

Modular and maintainable structure:

- `src/entry`: extension entry point (`vscode`)
- `src/business`: pure business logic
- `src/services`: filesystem and process execution integration
- `src/config`: configuration
- `src/utils`: shared utilities
- `src/types`: types and interfaces

## Configuration

The Fork path is configured from VS Code:

- setting: `fork.executablePath`
- setting: `fork.forceNewWindow` (default `true`)
- setting: `fork.runtimeOS` (updated automatically by the extension)

Fork location lookup does not run on every command: it uses a cache and only searches again on first run or if the configured/cached path no longer exists.

## UI

- The extension activates automatically when VS Code starts (`onStartupFinished`), without needing to run the command first.
- A `Fork` icon/button is shown in the VS Code bottom bar (right side).
- An icon action is also added to `SCM title` and `editor title` for quick access.
- Clicking it runs the `fork.open` command.

## Logging

The extension writes logs with `log.trace` / `log.info` / `log.error` to the **Fork** output channel.

## Main Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run format:write
npm run typecheck
```

## Recommended Release Flow

1. Update the version and `CHANGELOG.md`.
2. Run local validations:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run build`
3. Generate a reproducible artifact:
   - `npm run pack`
