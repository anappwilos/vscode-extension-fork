# Change Log

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
