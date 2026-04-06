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

async function resolveWindowsForkExecutable(configuredPath: string): Promise<string> {
  if (configuredPath) {
    return configuredPath
  }

  const candidates = [
    process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'Fork', 'Fork.exe') : '',
    process.env['ProgramFiles'] ? join(process.env['ProgramFiles'], 'Fork', 'Fork.exe') : '',
    process.env['ProgramFiles(x86)'] ? join(process.env['ProgramFiles(x86)'], 'Fork', 'Fork.exe') : '',
  ].filter(Boolean)

  for (const candidate of candidates) {
    if (await canAccess(candidate)) {
      return candidate
    }
  }

  return 'fork'
}

export async function openRepositoryInFork(context: LaunchContext, run: ExecFileRunner): Promise<void> {
  if (context.platform !== 'win32') {
    throw new Error('Fork extension: por el momento solo es viable en Windows.')
  }

  const executable = await resolveWindowsForkExecutable(context.executablePath)

  try {
    if (context.forceNewWindow) {
      await run(executable, [])
      await run(executable, [context.repositoryPath])
      return
    }

    await run(executable, [context.repositoryPath])
  }
  catch {
    throw new Error('No se encontró Fork en Windows. Configura "fork.executablePath" con la ruta a Fork.exe.')
  }
}
