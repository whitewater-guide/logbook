import Koa from 'koa';
import addPingRoute from './ping';
import bodyParser from 'koa-bodyparser';
import { corsMiddleware } from './cors';
import jwt from 'koa-jwt';
import log from 'packages/server/src/log';
import { teardownDB } from 'packages/server/src/db';

export type App = Koa & {
  shutdown: () => Promise<any>;
};

export const createApp = (): App => {
  const app = new Koa();
  app.silent = true;
  app.proxy = process.env.NODE_ENV === 'production';
  app.on('error', (err) => log.error(err));

  app.use(corsMiddleware);
  app.use(bodyParser());
  app.use(jwt({ secret: process.env.JWT_SECRET, passthrough: true }));

  addPingRoute(app);

  return Object.assign(app, {
    shutdown: async () => {
      await teardownDB();
    },
  });
};
