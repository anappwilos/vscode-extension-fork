import { test } from 'node:test'
import assert from 'node:assert/strict'
import { selectWorkspaceRoot } from '../../src/business/selectWorkspaceRoot'

test('selectWorkspaceRoot should prefer active editor workspace path', () => {
  const result = selectWorkspaceRoot({
    activeEditorWorkspacePath: '/repo/active',
    workspacePaths: ['/repo/fallback'],
  })

  assert.equal(result, '/repo/active')
})

test('selectWorkspaceRoot should fallback to first workspace path', () => {
  const result = selectWorkspaceRoot({
    workspacePaths: ['/repo/first', '/repo/second'],
  })

  assert.equal(result, '/repo/first')
})
