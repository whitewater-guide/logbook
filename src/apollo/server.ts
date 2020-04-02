import * as Koa from 'koa';

import { Context, context } from './context';

import { ApolloServer } from 'apollo-server-koa';
import DescentsService from '~/features/descents/descents.service';
import { formatError } from './formatError';
import loadSchema from './schema';
import { logger } from './logger';

export const createApolloServer = async (app: Koa) => {
  const schema = await loadSchema();
  const server = new ApolloServer({
    schema,
    context,
    formatError,
    debug: process.env.NODE_ENV === 'development',
    introspection: process.env.APOLLO_EXPOSE_SCHEMA === 'true',
    playground: process.env.APOLLO_EXPOSE_PLAYGROUND === 'true',
    dataSources: () => ({
      descents: new DescentsService(),
    }),
  });

  server.applyMiddleware({
    app,
    bodyParserConfig: false,
    cors: false,
  });

  logger.info('Initialized apollo-server-koa');
};

export const createTestApolloServer = async (ctx: Context) => {
  const schema = await loadSchema();
  return new ApolloServer({
    schema,
    context: ctx,
    formatError,
    debug: false,
    introspection: false,
    playground: false,
    dataSources: () => ({
      descents: new DescentsService(),
    }),
  });
};
