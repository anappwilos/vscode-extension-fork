import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createLogger } from '../../src/services/loggerService'

test('createLogger forwards trace, info and error messages to output channel', () => {
  const traceMessages: string[] = []
  const infoMessages: string[] = []
  const errorMessages: string[] = []

  const logger = createLogger({
    trace(message: string) {
      traceMessages.push(message)
    },
    info(message: string) {
      infoMessages.push(message)
    },
    error(message: string) {
      errorMessages.push(message)
    },
  } as never)

  logger.trace('hello trace')
  logger.info('hello info')
  logger.error('hello error')

  assert.deepEqual(traceMessages, ['hello trace'])
  assert.deepEqual(infoMessages, ['hello info'])
  assert.deepEqual(errorMessages, ['hello error'])
})
