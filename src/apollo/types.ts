import { Context } from './context';
import { GraphQLFieldResolver } from 'graphql';

export type TopLevelResolver<Vars = {}> = GraphQLFieldResolver<
  any,
  Context,
  Vars
>;

export type FieldResolvers<TRaw, TOut> = {
  [P in keyof TOut]?: GraphQLFieldResolver<TRaw, Context>;
} & { __resolveType?: GraphQLFieldResolver<TRaw, Context> };
