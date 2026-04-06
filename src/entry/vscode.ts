import process from 'node:process'
import type { ExtensionContext } from 'vscode'
import { commands, window, workspace } from 'vscode'
import { selectWorkspaceRoot } from '../business/selectWorkspaceRoot'
import { createAppConfig } from '../config/appConfig'
import { openRepositoryInFork } from '../services/forkLaunchService'
import { isGitRepository } from '../services/gitRepositoryService'
import { execFileRunner } from '../utils/exec'

function getVscodeConfiguredExecutablePath(): string {
  return workspace.getConfiguration('fork').get<string>('executablePath', '')
}

function getCurrentWorkspaceSelection(): string | undefined {
  const activeEditorPath = window.activeTextEditor
    ? workspace.getWorkspaceFolder(window.activeTextEditor.document.uri)?.uri.fsPath
    : undefined

  const workspacePaths = (workspace.workspaceFolders ?? []).map(folder => folder.uri.fsPath)

  return selectWorkspaceRoot({
    activeEditorWorkspacePath: activeEditorPath,
    workspacePaths,
  })
}

export async function activate(context: ExtensionContext): Promise<void> {
  const disposable = commands.registerCommand('fork.open', async () => {
    const repositoryPath = getCurrentWorkspaceSelection()

    if (!repositoryPath) {
      window.showErrorMessage('Fork error: no workspace folder found. Open a folder and try again.')
      return
    }

    const repositoryIsValid = await isGitRepository(repositoryPath)
    if (!repositoryIsValid) {
      window.showErrorMessage('Fork error: selected folder is not a Git repository.')
      return
    }

    const config = createAppConfig(getVscodeConfiguredExecutablePath())

    try {
      await openRepositoryInFork({
        platform: process.platform,
        executablePath: config.forkExecutablePath,
        repositoryPath,
      }, execFileRunner)
    }
    catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      window.showErrorMessage(`Fork error: ${message}`)
    }
  })

  context.subscriptions.push(disposable)
}

export function deactivate(): void {}
