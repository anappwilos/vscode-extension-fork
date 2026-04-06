import process from 'node:process'
import type { ExtensionContext, LogOutputChannel } from 'vscode'
import { commands, window, workspace } from 'vscode'
import { selectWorkspaceRoot } from '../business/selectWorkspaceRoot'
import { createAppConfig } from '../config/appConfig'
import { openRepositoryInFork } from '../services/forkLaunchService'
import { isGitRepository } from '../services/gitRepositoryService'
import { createLogger } from '../services/loggerService'
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
  const logChannel: LogOutputChannel = window.createOutputChannel('Fork', { log: true })
  const log = createLogger(logChannel)

  context.subscriptions.push(logChannel)
  log.info('Fork extension activated')

  const disposable = commands.registerCommand('fork.open', async () => {
    log.info('fork.open command triggered')
    logChannel.show(true)

    const repositoryPath = getCurrentWorkspaceSelection()

    if (!repositoryPath) {
      const message = 'Fork error: no workspace folder found. Open a folder and try again.'
      log.error(message)
      window.showErrorMessage(message)
      return
    }

    const repositoryIsValid = await isGitRepository(repositoryPath)
    if (!repositoryIsValid) {
      const message = 'Fork error: selected folder is not a Git repository.'
      log.error(message)
      window.showErrorMessage(message)
      return
    }

    const config = createAppConfig(getVscodeConfiguredExecutablePath())

    try {
      await openRepositoryInFork(
        {
          platform: process.platform,
          executablePath: config.forkExecutablePath,
          repositoryPath,
        },
        execFileRunner,
      )
      log.info(`Fork opened for repository: ${repositoryPath}`)
    }
    catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      log.error(`Fork launch failed: ${message}`)
      window.showErrorMessage(`Fork error: ${message}`)
    }
  })

  context.subscriptions.push(disposable)
}

export function deactivate(): void {}
