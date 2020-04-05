import Koa from 'koa';
import Router from 'koa-router';
import get from 'lodash/get';

const addPingRoute = (app: Koa, route = '/ping') => {
  const pingRouter = new Router({ methods: ['HEAD', 'GET', 'OPTIONS'] });

  pingRouter.get(route, (ctx) => {
    const uid = get(ctx.state?.user, process.env.JWT_UID_KEY || 'sub');
    ctx.body = {
      success: true,
      uid,
    };
  });

  app.use(pingRouter.allowedMethods());
  app.use(pingRouter.routes());
};

export default addPingRoute;
