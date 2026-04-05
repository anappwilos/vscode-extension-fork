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

async function hasGitDirectory(workspaceUri: Uri): Promise<boolean> {
  const gitDir = join(workspaceUri.fsPath, '.git')
  try {
    await access(gitDir)
    return true
  }
  catch {
    return false
  }
}

function openRepoInFork(workspaceUri: Uri): Promise<void> {
  return new Promise((resolve, reject) => {
    if (process.platform !== 'darwin') {
      reject(new Error('Fork extension currently supports macOS only.'))
      return
    }

    execFile('open', ['-a', 'Fork', workspaceUri.fsPath], (error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}

export async function activate(context: ExtensionContext) {
  const disposable = commands.registerCommand('fork.open', async () => {
    const workspaceFolder = getActiveWorkspaceFolder()

    if (!workspaceFolder) {
      window.showErrorMessage('Fork error: no workspace folder found. Open a folder and try again.')
      return
    }

    const isGitRepo = await hasGitDirectory(workspaceFolder.uri)
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
