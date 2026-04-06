# Change Log

## 0.3.7

- Ajuste de visibilidad del acceso rápido: status bar item movido al lado derecho con mayor prioridad.
- Agregado comando `fork.open` con ícono en `SCM title` y `editor title` para acceso rápido visible.
- Nuevos íconos light/dark para el comando (`res/fork-icon-light.svg`, `res/fork-icon-dark.svg`).

## 0.3.6

- Se agrega setting `fork.forceNewWindow` (default `true`).
- En Windows, cuando está activo, se intenta lanzar `fork <repo>` para forzar apertura en nueva ventana.
- Fallback automático a `Fork.exe` si el CLI `fork` no está disponible.

## 0.3.5

- Se agrega ícono/botón en la barra inferior de VS Code para ejecutar `fork.open`.
- El botón usa `$(source-control) Fork` con tooltip y comando directo.

## 0.3.4

- Se fuerza soporte operativo únicamente para Windows (mensaje explícito en otros sistemas).
- Se añade búsqueda automática de `Fork.exe` en rutas comunes de Windows y fallback al comando `fork` en PATH.
- README actualizado con estado de viabilidad actual (Windows) y estrategia de detección.

## 0.3.3

- Agregado logger con `log.info` / `log.error` usando `LogOutputChannel` de VS Code.
- El comando `fork.open` ahora muestra y registra eventos/errores en el canal **Fork**.

## 0.3.2

- Reutilizado el `launch.json` solicitado con todos los perfiles VSCODE/ANGRAVITY y perfiles de test.
- Añadidas tareas VS Code (`watch`, `npm`) para soportar `preLaunchTask` definidos en los perfiles.

## 0.3.1

- Eliminado soporte por variable de entorno para mantener configuración solo en VS Code (`fork.executablePath`).
- Eliminado runtime entry no necesario (`src/entry/start.ts`) para enfocar el proyecto únicamente como extensión.
- Corregido build con esbuild añadiendo `--external:vscode` para evitar el error `Could not resolve "vscode"`.

## 0.3.0

- Refactor técnico completo a arquitectura modular por capas (`entry`, `business`, `services`, `config`, `utils`, `types`).
- Migración del build a `esbuild` con sourcemaps en modo producción y desarrollo.
- Nuevo stack de calidad: ESLint moderno + Prettier + typecheck estricto.
- Infraestructura de testing con tests unitarios y smoke tests ejecutables con Node test runner.
- Nueva gestión de configuración con soporte de `fork.executablePath` + `FORK_EXECUTABLE_PATH`.
- CI con GitHub Actions para `lint`, `test` y `build`.
- Scripts npm profesionales: `dev`, `build`, `start`, `lint`, `format`, `format:write`, `test`, `typecheck`, `test:watch`, `prebuild`.

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
