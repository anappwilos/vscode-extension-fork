import { test } from 'node:test'
import assert from 'node:assert/strict'
import { openRepositoryInFork } from '../../src/services/forkLaunchService'

test('smoke: openRepositoryInFork should use configured executable path on Windows', async () => {
  const calls: Array<{ file: string, args: string[] }> = []

  const runner = async (file: string, args: string[]) => {
    calls.push({ file, args })
  }

  await openRepositoryInFork(
    {
      platform: 'win32',
      executablePath: 'C:/Fork/Fork.exe',
      repositoryPath: 'C:/tmp/repo',
      forceNewWindow: false,
    },
    runner,
  )

  assert.equal(calls.length, 1)
  assert.equal(calls[0].file, 'C:/Fork/Fork.exe')
  assert.deepEqual(calls[0].args, ['C:/tmp/repo'])
})

test('smoke: openRepositoryInFork should open new window then start repo with cmd start', async () => {
  const calls: Array<{ file: string, args: string[] }> = []

  const runner = async (file: string, args: string[]) => {
    calls.push({ file, args })
  }

  await openRepositoryInFork(
    {
      platform: 'win32',
      executablePath: 'C:/Fork/Fork.exe',
      repositoryPath: 'C:/tmp/repo',
      forceNewWindow: true,
    },
    runner,
  )

  assert.equal(calls.length, 2)
  assert.equal(calls[0].file, 'C:/Fork/Fork.exe')
  assert.deepEqual(calls[0].args, [])
  assert.equal(calls[1].file, 'cmd')
  assert.deepEqual(calls[1].args, ['/c', 'start', '', 'C:/Fork/Fork.exe', 'C:/tmp/repo'])
})

test('smoke: openRepositoryInFork should fail for non-Windows platforms', async () => {
  await assert.rejects(
    () =>
      openRepositoryInFork(
        {
          platform: 'darwin',
          executablePath: '',
          repositoryPath: '/tmp/repo',
          forceNewWindow: true,
        },
        async () => {},
      ),
    /solo es viable en Windows/,
  )
})
