import { QueryLogbookDescentShareTokenArgs } from '~/__generated__/graphql';
import { isAuthenticatedResolver } from '~/apollo/enhancedResolvers';
import { TopLevelResolver } from '~/apollo/types';

const descentShareToken: TopLevelResolver<QueryLogbookDescentShareTokenArgs> = async (
  _,
  { id },
  { dataSources },
) => {
  return dataSources?.descents.getShareToken(id);
};

export default isAuthenticatedResolver(descentShareToken);
