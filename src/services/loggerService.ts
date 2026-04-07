import type { LogOutputChannel } from 'vscode'

export type LogLevel = 'trace' | 'info' | 'error' | 'off'

export interface Logger {
  trace: (message: string) => void
  info: (message: string) => void
  error: (message: string) => void
}

function levelRank(level: LogLevel): number {
  switch (level) {
    case 'trace': return 0
    case 'info': return 1
    case 'error': return 2
    case 'off': return 3
  }
}

export function createLogger(channel: LogOutputChannel, getLevel: () => LogLevel): Logger {
  return {
    trace(message: string) {
      if (levelRank(getLevel()) <= 0)
        channel.trace(message)
    },
    info(message: string) {
      if (levelRank(getLevel()) <= 1)
        channel.info(message)
    },
    error(message: string) {
      if (levelRank(getLevel()) <= 2)
        channel.error(message)
    },
  }
}
