import { test } from 'node:test'
import assert from 'node:assert/strict'
import { openRepositoryInFork } from '../../src/services/forkLaunchService'

test('smoke: openRepositoryInFork should use configured executable path', async () => {
  const calls: Array<{ file: string, args: string[] }> = []

  const runner = async (file: string, args: string[]) => {
    calls.push({ file, args })
  }

  await openRepositoryInFork({
    platform: 'linux',
    executablePath: '/usr/local/bin/fork',
    repositoryPath: '/tmp/repo',
  }, runner)

  assert.equal(calls.length, 1)
  assert.equal(calls[0].file, '/usr/local/bin/fork')
  assert.deepEqual(calls[0].args, ['/tmp/repo'])
})
