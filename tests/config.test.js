const test = require('node:test');
const assert = require('node:assert/strict');

const {
  resolveProjectSelection,
  resolveSingleProject,
  normalizeRequestedProjectIds,
} = require('../dist/cli/config.js');

const sampleConfig = {
  baseUrl: 'https://example.test',
  projects: [
    { projectId: '1437', projectName: 'NPC Tasks', token: 'token-1' },
    { projectId: '1269', projectName: 'Admin Backend', token: 'token-2' },
    { projectId: 'local', projectName: 'Local Test', token: 'token-3', baseUrl: 'http://localhost:3000/' },
  ],
  defaultProjectId: '1437',
  defaultProjectIds: ['1437', '1269'],
};

test('normalizeRequestedProjectIds supports comma separated values and de-duplicates', () => {
  assert.deepEqual(normalizeRequestedProjectIds('1437,1269,1437'), ['1437', '1269']);
});

test('resolveProjectSelection uses multi-project defaults', () => {
  const resolved = resolveProjectSelection(sampleConfig);
  assert.deepEqual(resolved.map(project => project.projectId), ['1437', '1269']);
});

test('resolveSingleProject uses single-project default', () => {
  const resolved = resolveSingleProject(sampleConfig);
  assert.equal(resolved.projectId, '1437');
});

test('resolveSingleProject rejects multiple explicit project IDs', () => {
  assert.throws(
    () => resolveSingleProject(sampleConfig, '1437,1269'),
    /Exactly one project is required here/
  );
});

test('resolveProjectSelection respects per-project baseUrl overrides', () => {
  const resolved = resolveProjectSelection(sampleConfig, 'local');
  assert.equal(resolved[0].baseUrl, 'http://localhost:3000');
});
