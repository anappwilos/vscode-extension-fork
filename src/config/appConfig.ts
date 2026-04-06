import process from 'node:process'

export interface AppConfig {
  forkExecutablePath: string
}

export function getEnvForkExecutablePath(): string {
  return (process.env.FORK_EXECUTABLE_PATH ?? '').trim()
}

export function createAppConfig(vscodeConfiguredPath: string): AppConfig {
  return {
    forkExecutablePath: vscodeConfiguredPath.trim() || getEnvForkExecutablePath(),
  }
}
