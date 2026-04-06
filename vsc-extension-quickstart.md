# VS Code extension quickstart (updated)

## Project layout

- `package.json`: extension manifest (commands, activation, engines, scripts, settings).
- `src/index.ts`: extension entry point (`activate` / `deactivate`).
- `dist/`: build output produced by `tsup`.

## Runtime setting

- `fork.executablePath`: optional on macOS, required on Windows/Linux.

## Run in development

1. Install dependencies:
   - `npm install`
2. Build once:
   - `npm run build`
3. Start watch mode while editing:
   - `npm run dev`
4. Press `F5` in VS Code to launch an Extension Development Host.

## Quality checks

- Lint source files:
  - `npm run lint`

## Package and publish

- Create a VSIX package:
  - `npm run pack`
- Publish to marketplace:
  - `npm run publish`
