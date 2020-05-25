import { QueryLogbookDescentShareTokenArgs } from 'packages/server/src/__generated__/graphql';
import { TopLevelResolver } from 'packages/server/src/apollo/types';
import { isAuthenticatedResolver } from 'packages/server/src/apollo/enhancedResolvers';

const descentShareToken: TopLevelResolver<QueryLogbookDescentShareTokenArgs> = async (
  _,
  { id },
  { dataSources },
) => {
  return dataSources?.descents.getShareToken(id);
};

export default isAuthenticatedResolver(descentShareToken);
