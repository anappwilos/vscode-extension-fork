# Fork VS Code Extension

Extensión de VS Code para abrir el repositorio Git actual directamente en la app de escritorio **Fork**.

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
