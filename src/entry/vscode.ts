import { access } from 'node:fs/promises'
import process from 'node:process'
import type { ExtensionContext, LogOutputChannel, StatusBarItem } from 'vscode'
import { commands, ConfigurationTarget, StatusBarAlignment, window, workspace } from 'vscode'
import { selectWorkspaceRoot } from '../business/selectWorkspaceRoot'
import { createAppConfig } from '../config/appConfig'
import { openRepositoryInFork, resolveWindowsForkExecutable } from '../services/forkLaunchService'
import { isGitRepository } from '../services/gitRepositoryService'
import { createLogger } from '../services/loggerService'
import type { Logger, LogLevel } from '../services/loggerService'
import { execFileRunner } from '../utils/exec'

const FORK_EXECUTABLE_CACHE_KEY = 'fork.cachedExecutablePath'

function getVscodeConfiguredExecutablePath(): string {
  return workspace.getConfiguration('fork').get<string>('executablePath', '')
}

function getForceNewWindowSetting(): boolean {
  return workspace.getConfiguration('fork').get<boolean>('forceNewWindow', true)
}

function getLogLevelSetting(): LogLevel {
  return workspace.getConfiguration('fork').get<LogLevel>('logLevel', 'info')
}

async function canAccess(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  }
  catch {
    return false
  }
}

async function updateRuntimeOsSetting(log: Logger): Promise<void> {
  try {
    await workspace.getConfiguration('fork').update('runtimeOS', process.platform, ConfigurationTarget.Global)
    log.trace(`runtimeOS setting updated: ${process.platform}`)
  }
  catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    log.trace(`runtimeOS setting update skipped: ${message}`)
  }
}

async function resolveExecutablePath(context: ExtensionContext, log: Logger): Promise<string> {
  const configuredPath = getVscodeConfiguredExecutablePath().trim()
  if (configuredPath) {
    if (await canAccess(configuredPath)) {
      log.trace(`Using configured fork.executablePath: ${configuredPath}`)
      await context.globalState.update(FORK_EXECUTABLE_CACHE_KEY, configuredPath)
      return configuredPath
    }
    log.trace(`Configured path no longer exists: ${configuredPath}`)
  }

  const cachedPath = context.globalState.get<string>(FORK_EXECUTABLE_CACHE_KEY, '')
  if (cachedPath && (await canAccess(cachedPath))) {
    log.trace(`Using cached Fork executable: ${cachedPath}`)
    return cachedPath
  }

  log.trace('Resolving Fork executable path (first install or missing path).')
  const detectedPath = await resolveWindowsForkExecutable(configuredPath, log)

  if (detectedPath) {
    await context.globalState.update(FORK_EXECUTABLE_CACHE_KEY, detectedPath)

    if (!configuredPath || configuredPath !== detectedPath) {
      await workspace.getConfiguration('fork').update('executablePath', detectedPath, ConfigurationTarget.Global)
      log.trace(`Updated fork.executablePath with detected path: ${detectedPath}`)
    }
  }

  return detectedPath
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

function createForkStatusBarItem(): StatusBarItem {
  const item = window.createStatusBarItem(StatusBarAlignment.Right, 100)
  item.name = 'Fork Open Repository'
  item.text = '$(fork-custom)'
  item.command = 'fork.open'
  item.show()

  return item
}

export async function activate(context: ExtensionContext): Promise<void> {
  const logChannel: LogOutputChannel = window.createOutputChannel('Fork', { log: true })
  const log = createLogger(logChannel, getLogLevelSetting)

  context.subscriptions.push(logChannel)
  log.info('Fork extension activated')
  log.trace(`Running on platform: ${process.platform}`)

  await updateRuntimeOsSetting(log)

  const statusBarItem = createForkStatusBarItem()
  context.subscriptions.push(statusBarItem)
  log.info('Fork status bar action is visible')

  const disposable = commands.registerCommand('fork.open', async () => {
    log.info('fork.open command triggered')

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

    const executablePath = await resolveExecutablePath(context, log)
    const config = createAppConfig(executablePath, getForceNewWindowSetting())
    log.trace(`Command config: forceNewWindow=${config.forceNewWindow}, executablePath=${config.forkExecutablePath || 'none'}`)

    try {
      await openRepositoryInFork(
        {
          platform: process.platform,
          executablePath: config.forkExecutablePath,
          repositoryPath,
          forceNewWindow: config.forceNewWindow,
        },
        execFileRunner,
        log,
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
