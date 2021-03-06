import { buildFederatedSchema } from '@apollo/federation';
import { readFile } from 'fs-extra';
import gql from 'graphql-tag';

import { logger } from './logger';
import resolvers from './resolvers';

export const prepareServiceSchema = async () => {
  const typeDefs = await readFile(
    require.resolve('@whitewater-guide/logbook-schema/schema.graphql'),
    {
      encoding: 'utf8',
    },
  );
  return {
    typeDefs: gql(typeDefs),
    resolvers,
  };
};

export const loadSchema = async () => {
  const schema = await prepareServiceSchema();
  const result = buildFederatedSchema([schema]);
  logger.info('Initialized GRAPHQL schema');
  return result;
};
