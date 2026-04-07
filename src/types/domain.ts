export interface WorkspaceSelectionInput {
  activeEditorWorkspacePath?: string
  workspacePaths: string[]
}

export interface LaunchContext {
  platform: string
  executablePath: string
  repositoryPath: string
  forceNewWindow: boolean
}

export type ExecFileRunner = (file: string, args: string[]) => Promise<void>
