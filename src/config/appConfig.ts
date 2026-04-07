export interface AppConfig {
  forkExecutablePath: string
  forceNewWindow: boolean
}

export function createAppConfig(vscodeConfiguredPath: string, forceNewWindow: boolean): AppConfig {
  return {
    forkExecutablePath: vscodeConfiguredPath.trim(),
    forceNewWindow,
  }
}
