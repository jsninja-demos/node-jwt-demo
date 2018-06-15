const Router = require('koa-router');
const { find, list } = require('../../services/user');

const router = new Router();

router.get('/', async ctx => {
  const data = await list();
  ctx.body = data;
});

router.get('/:id', async ctx => {
  const user = await find({
    id: Number(ctx.params.id),
  });
  if (user) {
    ctx.body = user;
  }
});

module.exports = router;
