import { logger } from './logger';
import { makeExecutableSchema } from 'apollo-server';
import { readFile } from 'fs-extra';
import { resolve } from 'path';
import resolvers from './resolvers';

const loadSchema = async () => {
  const typeDefs = await readFile(resolve(process.cwd(), 'schema.graphql'), {
    encoding: 'utf8',
  });
  const result = makeExecutableSchema({
    typeDefs,
    resolvers,
    allowUndefinedInResolve: false,
  });
  logger.info('Initialized GRAPHQL schema');
  return result;
};

export default loadSchema;
