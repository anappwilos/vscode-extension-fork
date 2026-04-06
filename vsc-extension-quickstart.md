# VS Code extension quickstart (updated)

## Project layout

- `package.json`: extension manifest (commands, activation, engines, scripts, settings).
- `src/index.ts`: extension entry point (`activate` / `deactivate`).
- `dist/`: build output produced by `tsup`.

## Runtime setting

- `fork.executablePath`: optional on macOS, required on Windows/Linux.

## Run in development

1. Install dependencies:
   - `pnpm install`
2. Build once:
   - `pnpm build`
3. Start watch mode while editing:
   - `pnpm dev`
4. Press `F5` in VS Code to launch an Extension Development Host.

## Quality checks

- Lint source files:
  - `pnpm lint`

## Package and publish

- Create a VSIX package:
  - `pnpm pack`
- Publish to marketplace:
  - `pnpm publish`
