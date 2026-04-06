import type { ExtensionContext, Uri, WorkspaceFolder } from 'vscode'
import { execFile } from 'node:child_process'
import { access } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { commands, window, workspace } from 'vscode'

function getActiveWorkspaceFolder(): WorkspaceFolder | undefined {
  const activeEditor = window.activeTextEditor
  if (activeEditor) {
    return workspace.getWorkspaceFolder(activeEditor.document.uri)
  }

  return workspace.workspaceFolders?.[0]
}

function getForkExecutablePath(): string {
  return workspace.getConfiguration('fork').get<string>('executablePath', '').trim()
}

async function hasGitMetadata(workspaceUri: Uri): Promise<boolean> {
  const gitPath = join(workspaceUri.fsPath, '.git')
  try {
    await access(gitPath)
    return true
  }
  catch {
    return false
  }
}

function execFileAsync(file: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile(file, args, (error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}

async function openRepoInFork(workspaceUri: Uri): Promise<void> {
  const executablePath = getForkExecutablePath()

  if (executablePath) {
    await execFileAsync(executablePath, [workspaceUri.fsPath])
    return
  }

  if (process.platform === 'darwin') {
    await execFileAsync('open', ['-a', 'Fork', workspaceUri.fsPath])
    return
  }

  throw new Error('Set "fork.executablePath" to your Fork executable path in VS Code settings.')
}

export async function activate(context: ExtensionContext) {
  const disposable = commands.registerCommand('fork.open', async () => {
    const workspaceFolder = getActiveWorkspaceFolder()

    if (!workspaceFolder) {
      window.showErrorMessage('Fork error: no workspace folder found. Open a folder and try again.')
      return
    }

    const isGitRepo = await hasGitMetadata(workspaceFolder.uri)
    if (!isGitRepo) {
      window.showErrorMessage('Fork error: selected folder is not a Git repository.')
      return
    }

    try {
      await openRepoInFork(workspaceFolder.uri)
    }
    catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      window.showErrorMessage(`Fork error: ${message}`)
    }
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
