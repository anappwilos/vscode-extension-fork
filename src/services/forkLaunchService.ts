import type { ExecFileRunner, LaunchContext } from '../types/domain'

export async function openRepositoryInFork(context: LaunchContext, run: ExecFileRunner): Promise<void> {
  if (context.executablePath) {
    await run(context.executablePath, [context.repositoryPath])
    return
  }

  if (context.platform === 'darwin') {
    await run('open', ['-a', 'Fork', context.repositoryPath])
    return
  }

  throw new Error('Set "fork.executablePath" to your Fork executable path in VS Code settings.')
}
