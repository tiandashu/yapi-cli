const test = require('node:test');
const assert = require('node:assert/strict');

const {
  extractJsonSchemaFields,
  generateMock,
  generateTypesFromInterfaceSchema,
  pathToTypeName,
} = require('../dist/cli/core/json-schema.js');

test('extractJsonSchemaFields flattens nested object and array properties', () => {
  const fields = extractJsonSchemaFields(JSON.stringify({
    type: 'object',
    required: ['id', 'items'],
    properties: {
      id: { type: 'string', description: 'record id' },
      profile: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
        },
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string' },
          },
        },
      },
    },
  }));

  assert.deepEqual(fields.map(field => field.name), ['id', 'profile', 'profile.name', 'items', 'items[].title']);
});

test('generateMock returns representative values', () => {
  const mock = generateMock(JSON.stringify({
    type: 'object',
    properties: {
      ok: { type: 'boolean' },
      name: { type: 'string', example: 'demo' },
      count: { type: 'integer' },
    },
  }));

  assert.deepEqual(mock, { ok: true, name: 'demo', count: 0 });
});

test('generateTypesFromInterfaceSchema emits query and response types', () => {
  const code = generateTypesFromInterfaceSchema({
    method: 'get',
    path: '/user/login',
    title: 'Login',
    req_query: [{ name: 'mobile', required: '1', desc: 'phone number' }],
    res_body: JSON.stringify({
      type: 'object',
      required: ['token'],
      properties: {
        token: { type: 'string' },
      },
    }),
  }, 'Login');

  assert.match(code, /export interface LoginQuery/);
  assert.match(code, /mobile: string/);
  assert.match(code, /export interface LoginResponse/);
  assert.match(code, /token: string/);
});

test('pathToTypeName normalizes URL paths into type names', () => {
  assert.equal(pathToTypeName('/v1/user-profile/list'), 'V1User_profileList');
});
