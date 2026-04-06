import { access } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import type { ExecFileRunner, LaunchContext } from '../types/domain'

async function canAccess(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  }
  catch {
    return false
  }
}

export async function resolveWindowsForkExecutable(configuredPath: string): Promise<string> {
  const userProfile = process.env.USERPROFILE ?? ''

  const candidates = [
    configuredPath,
    process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'Fork', 'Fork.exe') : '',
    process.env['ProgramFiles'] ? join(process.env['ProgramFiles'], 'Fork', 'Fork.exe') : '',
    process.env['ProgramFiles(x86)'] ? join(process.env['ProgramFiles(x86)'], 'Fork', 'Fork.exe') : '',
    userProfile ? join(userProfile, 'AppData', 'Local', 'Fork', 'Fork.exe') : '',
    'C:\\Program Files\\Fork\\Fork.exe',
    'C:\\Program Files (x86)\\Fork\\Fork.exe',
  ].filter(Boolean)

  for (const candidate of candidates) {
    if (await canAccess(candidate)) {
      return candidate
    }
  }

  return ''
}

async function openRepositoryPath(
  run: ExecFileRunner,
  repositoryPath: string,
  fallbackExecutable: string,
): Promise<void> {
  try {
    await run('fork', [repositoryPath])
    return
  }
  catch {
    if (fallbackExecutable) {
      await run(fallbackExecutable, [repositoryPath])
      return
    }
    throw new Error('No se encontró Fork en Windows. Configura "fork.executablePath" con la ruta a Fork.exe.')
  }
}

export async function openRepositoryInFork(context: LaunchContext, run: ExecFileRunner): Promise<void> {
  if (context.platform !== 'win32') {
    throw new Error('Fork extension: por el momento solo es viable en Windows.')
  }

  if (context.forceNewWindow) {
    if (context.executablePath) {
      await run(context.executablePath, [])
    }
    else {
      await run('fork', [])
    }
  }

  await openRepositoryPath(run, context.repositoryPath, context.executablePath)
}
