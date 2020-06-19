import { createTestClient } from 'apollo-server-testing';
import { GraphQLResponse } from 'apollo-server-types';
import { DocumentNode } from 'graphql';

import { Context } from '~/apollo/context';
import { createTestApolloServer } from '~/apollo/server';

type Resp<Data> = Exclude<GraphQLResponse, 'data'> & { data: Data };

export const runQuery = async <
  Data = Record<string, any> | null,
  Vars = Record<string, any>
>(
  query: string | DocumentNode,
  variables?: Vars,
  uid?: string,
): Promise<Resp<Data>> => {
  const context: Context = { uid };
  const server = await createTestApolloServer(context);
  const client = createTestClient(server);
  const isMutation =
    typeof query === 'string'
      ? query.indexOf('mutation') >= 0
      : query.definitions.some((d: any) => d.operation === 'mutation');
  if (isMutation) {
    return client.mutate({ mutation: query, variables }) as any;
  } else {
    return client.query({ query, variables }) as any;
  }
};

export const expectTimestamp = () =>
  expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3,6}Z/);
