export interface AppConfig {
  forkExecutablePath: string
}

export function createAppConfig(vscodeConfiguredPath: string): AppConfig {
  return {
    forkExecutablePath: vscodeConfiguredPath.trim(),
  }
}
