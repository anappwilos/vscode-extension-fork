# Change Log

## 0.2.5

- Replaced deprecated `vsce` package with `@vscode/vsce`.
- Removed unused `pnpm` dev dependency after npm migration.
- Bumped extension version for dependency maintenance.

## 0.2.4

- Added `.vscode/launch.json` with launch profiles for:
  - `Run Fork Extension (VS Code)`
  - `Run Antigravity Playground`
  - `Run VS Code + Antigravity` (compound)
- Added `npm run antigravity` script.
- Added a basic Antigravity playground entry file at `playground/index.js`.

## 0.2.3

- Migrated project package management from pnpm to npm.
- Updated `packageManager` to `npm@11.4.2`.
- Updated publish script hook to use `npm run build`.
- Replaced pnpm commands in documentation with npm equivalents.

## 0.2.2

- Added `fork.executablePath` setting in extension configuration.
- Added support for launching Fork using a custom executable path.
- Kept macOS fallback (`open -a Fork`) when no path is configured.
- Improved non-macOS guidance with actionable configuration error message.

## 0.2.1

- Improved command robustness in `src/index.ts`.
- Added explicit Git repository validation before opening Fork.
- Switched process launch to `execFile` for safer command execution.
- Added clear platform handling and error messages.

## 0.2.0

- 2026 maintenance update.
- Updated extension metadata (description, command title, and version).
- Raised VS Code engine and `@types/vscode` compatibility to `^1.99.0`.
- Refreshed README and quickstart docs to match current project structure.

## 0.1.0

- Support opening the active folder within the workspace.

## 0.0.1

- Initial release.
