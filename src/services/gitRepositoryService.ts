import { access } from 'node:fs/promises'
import { join } from 'node:path'

export async function isGitRepository(repositoryPath: string): Promise<boolean> {
  try {
    await access(join(repositoryPath, '.git'))
    return true
  }
  catch {
    return false
  }
}
