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
    process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'Fork', 'current', 'fork.exe') : '',
    process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'Fork', 'Fork.exe') : '',
    process.env.ProgramFiles ? join(process.env.ProgramFiles, 'Fork', 'Fork.exe') : '',
    process.env['ProgramFiles(x86)'] ? join(process.env['ProgramFiles(x86)'], 'Fork', 'Fork.exe') : '',
    userProfile ? join(userProfile, 'AppData', 'Local', 'Fork', 'current', 'fork.exe') : '',
    userProfile ? join(userProfile, 'AppData', 'Local', 'Fork', 'Fork.exe') : '',
    'C:\\Users\\Developer\\AppData\\Local\\Fork\\current\\fork.exe',
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

export async function openRepositoryInFork(context: LaunchContext, run: ExecFileRunner): Promise<void> {
  if (context.platform !== 'win32') {
    throw new Error('Fork extension: por el momento solo es viable en Windows.')
  }

  const executable = context.executablePath || (await resolveWindowsForkExecutable(''))
  if (!executable) {
    throw new Error('No se encontró Fork en Windows. Configura "fork.executablePath" con la ruta a Fork.exe.')
  }

  if (context.forceNewWindow) {
    await run('cmd', ['/c', 'start', '', executable])
    await run('cmd', ['/c', 'start', '', executable, context.repositoryPath])
    return
  }

  await run(executable, [context.repositoryPath])
}
