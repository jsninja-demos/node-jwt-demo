const { test } = require('ava');
const agent = require('supertest-koa-agent');
const createApp = require('../src/app');

const app = agent(createApp());

test('Users list', async t => {
  const res = await app.get('/users');
  t.is(res.status, 200);
  t.truthy(Array.isArray(res.body));
});

test('Get user by id should be ok', async t => {
  const res = await app.get('/users/1');
  t.is(res.status, 200);
});

test('Get user by invalid id should be 404', async t => {
  const res = await app.get('/users/666');
  t.is(res.status, 404);
});
