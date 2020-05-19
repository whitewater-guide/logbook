import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';

import { Context } from './context';

export type TopLevelResolver<Vars = {}> = GraphQLFieldResolver<
  any,
  Context,
  Vars
>;

export type FieldResolvers<TRaw, TOut> = {
  [P in keyof TOut]?: GraphQLFieldResolver<TRaw, Context>;
} & {
  __resolveType?: GraphQLFieldResolver<TRaw, Context>;
  __resolveReference?: (
    reference: any,
    context: Context,
    info: GraphQLResolveInfo,
  ) => any;
};
