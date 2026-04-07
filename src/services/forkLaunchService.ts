import { access } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import type { ExecFileRunner, LaunchContext } from '../types/domain'
import type { Logger } from './loggerService'

async function canAccess(path: string): Promise<boolean> {
  if (!path) {
    return false
  }

  try {
    await access(path)
    return true
  }
  catch {
    return false
  }
}

function normalizePath(value: string | undefined | null): string {
  return (value ?? '').trim().replace(/^["']|["']$/g, '')
}

export async function resolveWindowsForkExecutable(configuredPath: string, logger: Logger): Promise<string> {
  const userProfile = process.env.USERPROFILE ?? ''

  const candidates = [
    configuredPath,
    process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'Fork', 'current', 'fork.exe') : '',
    process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'Fork', 'Fork.exe') : '',
    process.env.ProgramFiles ? join(process.env.ProgramFiles, 'Fork', 'Fork.exe') : '',
    process.env['ProgramFiles(x86)'] ? join(process.env['ProgramFiles(x86)'], 'Fork', 'Fork.exe') : '',
    userProfile ? join(userProfile, 'AppData', 'Local', 'Fork', 'current', 'fork.exe') : '',
    userProfile ? join(userProfile, 'AppData', 'Local', 'Fork', 'Fork.exe') : '',
  ]
    .map(normalizePath)
    .filter(Boolean)

  const uniqueCandidates = [...new Set(candidates)]

  logger.trace('Resolving Fork executable...')
  logger.trace(`Configured path: ${configuredPath || '(empty)'}`)
  logger.trace(`Candidates: ${JSON.stringify(uniqueCandidates)}`)

  for (const candidate of uniqueCandidates) {
    const exists = await canAccess(candidate)
    logger.trace(`Checking candidate: ${candidate} -> ${exists ? 'OK' : 'NOT FOUND'}`)

    if (exists) {
      logger.trace(`Fork found at: ${candidate}`)
      return candidate
    }
  }

  logger.trace('No valid Fork executable found.')
  return ''
}

async function openRepositoryInForkNewWindow(
  executable: string,
  repositoryPath: string,
  run: ExecFileRunner,
  logger: Logger,
): Promise<void> {
  const args = [
    '/d',
    '/c',
    'start',
    '',
    executable,
    '&&',
    'start',
    '',
    executable,
    repositoryPath,
  ]

  logger.trace('New window mode enabled.')
  logger.trace(`Executable: ${executable}`)
  logger.trace(`Repository: ${repositoryPath}`)
  logger.trace(`Args: ${JSON.stringify(args)}`)

  try {
    await run('cmd.exe', args)
    logger.trace('Command executed successfully.')
  }
  catch (error) {
    logger.error(`Error executing cmd.exe: ${error instanceof Error ? error.message : String(error)}`)
    throw error
  }
}

export async function openRepositoryInFork(context: LaunchContext, run: ExecFileRunner, logger: Logger): Promise<void> {
  logger.trace(`openRepositoryInFork called: platform=${context.platform}, executablePath=${context.executablePath ?? ''}, repositoryPath=${context.repositoryPath}, forceNewWindow=${context.forceNewWindow}`)

  if (context.platform !== 'win32') {
    throw new Error('Fork extension: only Windows is currently supported.')
  }

  const executable = await resolveWindowsForkExecutable(context.executablePath || '', logger)
  if (!executable) {
    throw new Error('Fork not found. Set "fork.executablePath" in your settings to point to Fork.exe.')
  }

  const repositoryPath = normalizePath(context.repositoryPath)
  if (!repositoryPath) {
    throw new Error('Fork extension: repository path is required.')
  }

  if (context.forceNewWindow) {
    await openRepositoryInForkNewWindow(executable, repositoryPath, run, logger)
    return
  }

  logger.trace('Normal mode. Opening Fork with repository directly.')
  logger.trace(`Executable: ${executable}`)
  logger.trace(`Repository: ${repositoryPath}`)

  try {
    await run(executable, [repositoryPath])
    logger.trace('Fork launched successfully.')
  }
  catch (error) {
    logger.error(`Error opening Fork: ${error instanceof Error ? error.message : String(error)}`)
    throw error
  }
}
