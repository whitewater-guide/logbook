import Koa from 'koa';
import addPingRoute from './ping';
import bodyParser from 'koa-bodyparser';
import { corsMiddleware } from './cors';
import db from '~/db';
import log from '~/log';

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

  addPingRoute(app);

  return Object.assign(app, {
    shutdown: async () => {
      await db.end();
    },
  });
};
