import { Context } from 'packages/server/src/apollo/context';
import { DocumentNode } from 'graphql';
import { GraphQLResponse } from 'apollo-server-types';
import { createTestApolloServer } from 'packages/server/src/apollo/server';
import { createTestClient } from 'apollo-server-testing';

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
