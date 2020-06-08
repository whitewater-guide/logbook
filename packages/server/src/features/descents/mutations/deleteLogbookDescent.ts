import { MutationDeleteLogbookDescentArgs } from '~/__generated__/graphql';
import { isAuthenticatedResolver } from '~/apollo/enhancedResolvers';
import { TopLevelResolver } from '~/apollo/types';

const upsertLogbookDescent: TopLevelResolver<MutationDeleteLogbookDescentArgs> = async (
  _,
  { id },
  { dataSources },
) => {
  await dataSources?.descents.deleteById(id);
  return true;
};

export default isAuthenticatedResolver(upsertLogbookDescent);
