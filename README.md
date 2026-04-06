# Fork VS Code Extension

Extensión de VS Code para abrir el repositorio Git actual directamente en la app de escritorio **Fork**.

## Estado actual de plataforma (2026)

> **Por ahora esta extensión se considera viable solo en Windows.**

Investigación de referencia:

- Fork se presenta como app para Mac y Windows en su sitio oficial: https://fork.dev/releasenotes
- Existe distribución en Windows vía winget (`Fork.Fork`): https://winget.run/pkg/Fork/Fork

## Cómo encuentra Fork en Windows

Orden de resolución:

1. `fork.executablePath` (si lo defines en VS Code)
2. `%LOCALAPPDATA%\Fork\Fork.exe`
3. `%ProgramFiles%\Fork\Fork.exe`
4. `%ProgramFiles(x86)%\Fork\Fork.exe`
5. comando `fork` en `PATH`

Si no encuentra ejecutable, mostrará error y pedirá configurar `fork.executablePath`.

## Arquitectura

Estructura modular y mantenible:

- `src/entry`: entrada de la extensión (`vscode`)
- `src/business`: lógica de negocio pura
- `src/services`: integración con sistema de archivos y ejecución de procesos
- `src/config`: configuración
- `src/utils`: utilidades compartidas
- `src/types`: tipos e interfaces
- `tests`: unit tests y smoke tests

## Configuración

La ruta de Fork se configura desde VS Code:

- setting: `fork.executablePath`

## Logging

La extensión escribe logs con `log.info` / `log.error` en el canal de salida **Fork**.

## Scripts principales

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run format:write
npm run typecheck
npm run test
npm run test:watch
```

## Flujo recomendado de release

1. Actualizar versión y `CHANGELOG.md`.
2. Ejecutar validaciones locales:
   - `npm run lint`
   - `npm run test`
   - `npm run build`
3. Generar artefacto reproducible:
   - `npm run pack`

## CI

Se incluye workflow de GitHub Actions (`.github/workflows/ci.yml`) que ejecuta:

- instalación (`npm ci`)
- lint
- tests
- build
