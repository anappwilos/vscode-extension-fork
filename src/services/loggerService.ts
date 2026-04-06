import type { LogOutputChannel } from 'vscode'

export interface Logger {
  info: (message: string) => void
  error: (message: string) => void
}

export function createLogger(channel: LogOutputChannel): Logger {
  return {
    info(message: string) {
      channel.info(message)
    },
    error(message: string) {
      channel.error(message)
    },
  }
}
