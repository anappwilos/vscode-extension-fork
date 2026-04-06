# Fork VS Code Extension

Extensión de VS Code para abrir el repositorio Git actual directamente en la app de escritorio **Fork**.

## Arquitectura

Estructura modular y mantenible:

- `src/entry`: puntos de entrada (`vscode` y `start`)
- `src/business`: lógica de negocio pura
- `src/services`: integración con sistema de archivos y ejecución de procesos
- `src/config`: configuración y variables de entorno
- `src/utils`: utilidades compartidas
- `src/types`: tipos e interfaces
- `tests`: unit tests y smoke tests

## Configuración

Puedes configurar la ruta de Fork por dos vías:

1. Setting de VS Code: `fork.executablePath`
2. Variable de entorno: `FORK_EXECUTABLE_PATH`

Prioridad: setting de VS Code > variable de entorno.

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
