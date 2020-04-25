import { QueryDescentShareTokenArgs } from '~/__generated__/graphql';
import { TopLevelResolver } from '~/apollo/types';
import { isAuthenticatedResolver } from '~/apollo/enhancedResolvers';

const descentShareToken: TopLevelResolver<QueryDescentShareTokenArgs> = async (
  _,
  { id },
  { dataSources },
) => {
  return dataSources?.descents.getShareToken(id);
};

export default isAuthenticatedResolver(descentShareToken);
