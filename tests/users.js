const { test } = require('ava');
const agent = require('supertest-koa-agent');
const createApp = require('../src/app');
const issueToken = require('./helpers/issueToken');

const app = agent(createApp());
const authLine = `Bearer ${issueToken({ id: 1 })}`;

test('Users list', async t => {
  const res = await app.get('/users').set('Authorization', authLine);
  t.is(res.status, 200);
  t.truthy(Array.isArray(res.body));
});

test('Get user by id should be ok', async t => {
  const res = await app.get('/users/1').set('Authorization', authLine);
  t.is(res.status, 200);
  t.is(res.body.login, 'user');
});

test('Get user by invalid id should be 404', async t => {
  const res = await app.get('/users/666').set('Authorization', authLine);
  t.is(res.status, 404);
});
