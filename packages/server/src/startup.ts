import { initYup } from '@whitewater-guide/validation';

import { createApolloServer } from './apollo/server';
import { createApp } from './koa';
import log from './log';
import startServer from './server';

async function startup() {
  initYup();
  const app = createApp();
  await createApolloServer(app);
  startServer(app);
  log.info('Startup complete');
}

export default startup;
