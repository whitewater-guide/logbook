import { MutationDeleteLogbookSectionArgs } from 'packages/server/src/__generated__/graphql';
import { TopLevelResolver } from 'packages/server/src/apollo/types';
import { isAuthenticatedResolver } from 'packages/server/src/apollo/enhancedResolvers';

const deleteLogbookSection: TopLevelResolver<MutationDeleteLogbookSectionArgs> = async (
  _,
  { id },
  { dataSources },
) => {
  await dataSources?.sections.deleteById(id);
  return true;
};

export default isAuthenticatedResolver(deleteLogbookSection);
