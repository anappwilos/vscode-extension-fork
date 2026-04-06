import type { LogOutputChannel } from 'vscode'

export interface Logger {
  trace: (message: string) => void
  info: (message: string) => void
  error: (message: string) => void
}

export function createLogger(channel: LogOutputChannel): Logger {
  return {
    trace(message: string) {
      channel.trace(message)
    },
    info(message: string) {
      channel.info(message)
    },
    error(message: string) {
      channel.error(message)
    },
  }
}
