import { execFile } from 'node:child_process'
import type { ExecFileRunner } from '../types/domain'

export const execFileRunner: ExecFileRunner = async (file, args) => {
  await new Promise<void>((resolve, reject) => {
    execFile(file, args, (error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}
