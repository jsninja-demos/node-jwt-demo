const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { compareSync } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtMiddleware = require('koa-jwt');

const uuid = require('uuid/v4');

const userService = require('../../services/user');
const refreshTokenService = require('../../services/refreshToken');
const config = require('../../config');

const router = new Router();

async function issueTokenPair(userId) {
  const newRefreshToken = uuid();
  await refreshTokenService.add({
    token: newRefreshToken,
    userId,
  });

  return {
    token: jwt.sign({ id: userId }, config.secret),
    refreshToken: newRefreshToken,
  };
}

router.post('/login', bodyParser(), async ctx => {
  const { login, password } = ctx.request.body;
  const user = await userService.find({ login });
  if (!user || !compareSync(password, user.password)) {
    const error = new Error();
    error.status = 403;
    throw error;
  }
  ctx.body = await issueTokenPair(user.id);
});

router.post('/refresh', bodyParser(), async ctx => {
  const { refreshToken } = ctx.request.body;
  const dbToken = await refreshTokenService.find({ token: refreshToken });
  if (!dbToken) {
    return;
  }
  await refreshTokenService.remove({
    token: refreshToken,
  });
  ctx.body = await issueTokenPair(dbToken.userId);
});

router.post('/logout', jwtMiddleware({ secret: config.secret }), async ctx => {
  const { id: userId } = ctx.state.user;
  await refreshTokenService.remove({
    userId,
  });
  ctx.body = { success: true };
});

module.exports = router;
