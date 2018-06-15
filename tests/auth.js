const { test } = require('ava');
const agent = require('supertest-koa-agent');
const createApp = require('../src/app');
const issueToken = require('./helpers/issueToken');

const app = agent(createApp());

test('User can succesfully login', async t => {
  const res = await app.post('/auth/login').send({
    login: 'user',
    password: 'user',
  });
  t.is(res.status, 200);
  t.truthy(typeof res.body.token === 'string');
  t.truthy(typeof res.body.refreshToken === 'string');

  const refreshTokenRes = await app.post('/auth/refresh').send({
    refreshToken: res.body.refreshToken,
  });
  t.is(refreshTokenRes.status, 200);
  t.truthy(typeof refreshTokenRes.body.token === 'string');
  t.truthy(typeof refreshTokenRes.body.refreshToken === 'string');
});

test('User gets 403 on invalid credentials', async t => {
  const res = await app.post('/auth/login').send({
    login: 'INVALID',
    password: 'INVALID',
  });
  t.is(res.status, 403);
});

test('User receives 401 on expired token', async t => {
  const expiredToken = issueToken({ id: 1 }, { expiresIn: '1ms' });
  const res = await app
    .get('/users')
    .set('Authorization', `Bearer ${expiredToken}`);
  t.is(res.status, 401);
});

test('User can get new access token using refresh token', async t => {
  const res = await app.post('/auth/refresh').send({
    refreshToken: 'REFRESH_TOKEN_1',
  });
  t.is(res.status, 200);
  t.truthy(typeof res.body.token === 'string');
  t.truthy(typeof res.body.refreshToken === 'string');
});

test('User get 404 on invalid refresh token', async t => {
  const res = await app.post('/auth/refresh').send({
    refreshToken: 'INVALID_REFRESH_TOKEN',
  });
  t.is(res.status, 404);
});

test('User can use refresh token only once', async t => {
  const firstResponse = await app.post('/auth/refresh').send({
    refreshToken: 'REFRESH_TOKEN_ONCE',
  });
  t.is(firstResponse.status, 200);
  t.truthy(typeof firstResponse.body.token === 'string');
  t.truthy(typeof firstResponse.body.refreshToken === 'string');

  const secondResponse = await app.post('/auth/refresh').send({
    refreshToken: 'REFRESH_TOKEN_ONCE',
  });
  t.is(secondResponse.status, 404);
});

test('Refresh tokens become invalid on logout', async t => {
  const logoutRes = await app
    .post('/auth/logout')
    .set('Authorization', `Bearer ${issueToken({ id: 2 })}`);

  t.is(logoutRes.status, 200);

  const res = await app.post('/auth/refresh').send({
    refreshToken: 'REFRESH_TOKEN_TO_DELETE_ON_LOGOUT',
  });
  t.is(res.status, 404);
});

test('Multiple refresh tokens are valid', async t => {
  const firstLoginResponse = await app.post('/auth/login').send({
    login: 'user2',
    password: 'user2',
  });
  const secondLoginResponse = await app.post('/auth/login').send({
    login: 'user2',
    password: 'user2',
  });
  t.is(firstLoginResponse.status, 200);
  t.is(secondLoginResponse.status, 200);

  const firstRefreshResponse = await app.post('/auth/refresh').send({
    refreshToken: firstLoginResponse.body.refreshToken,
  });
  t.is(firstRefreshResponse.status, 200);
  t.truthy(typeof firstRefreshResponse.body.token === 'string');
  t.truthy(typeof firstRefreshResponse.body.refreshToken === 'string');

  const secondRefreshResponse = await app.post('/auth/refresh').send({
    refreshToken: secondLoginResponse.body.refreshToken,
  });
  t.is(secondRefreshResponse.status, 200);
  t.truthy(typeof secondRefreshResponse.body.token === 'string');
  t.truthy(typeof secondRefreshResponse.body.refreshToken === 'string');
});
