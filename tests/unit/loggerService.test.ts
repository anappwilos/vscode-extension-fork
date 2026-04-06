import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createLogger } from '../../src/services/loggerService'

test('createLogger forwards info and error messages to output channel', () => {
  const infoMessages: string[] = []
  const errorMessages: string[] = []

  const logger = createLogger({
    info(message: string) {
      infoMessages.push(message)
    },
    error(message: string) {
      errorMessages.push(message)
    },
  } as never)

  logger.info('hello info')
  logger.error('hello error')

  assert.deepEqual(infoMessages, ['hello info'])
  assert.deepEqual(errorMessages, ['hello error'])
})
