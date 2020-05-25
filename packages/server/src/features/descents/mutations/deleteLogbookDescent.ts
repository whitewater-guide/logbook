import { MutationDeleteLogbookDescentArgs } from 'packages/server/src/__generated__/graphql';
import { TopLevelResolver } from 'packages/server/src/apollo/types';
import { isAuthenticatedResolver } from 'packages/server/src/apollo/enhancedResolvers';

const upsertLogbookDescent: TopLevelResolver<MutationDeleteLogbookDescentArgs> = async (
  _,
  { id },
  { dataSources },
) => {
  await dataSources?.descents.deleteById(id);
  return true;
};

export default isAuthenticatedResolver(upsertLogbookDescent);
