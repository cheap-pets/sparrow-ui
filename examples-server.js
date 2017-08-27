const Koa = require('koa');
const koaStatic = require('koa-static');
const path = require('path');
const send = require('koa-send');

const koa = new Koa();
koa.use(koaStatic(path.resolve(__dirname, 'examples')));
koa.use(async ctx => {
  if (ctx.path.indexOf('/dist') === 0) {
    await send(ctx, ctx.path);
  }
});

koa.listen(3000);
console.log('listening on port 3000.');
