import type { WorkspaceSelectionInput } from '../types/domain'

export function selectWorkspaceRoot(input: WorkspaceSelectionInput): string | undefined {
  if (input.activeEditorWorkspacePath) {
    return input.activeEditorWorkspacePath
  }

  return input.workspacePaths[0]
}
