import { MutationDeleteLogbookSectionArgs } from '~/__generated__/graphql';
import { TopLevelResolver } from '~/apollo/types';
import { isAuthenticatedResolver } from '~/apollo/enhancedResolvers';

const deleteLogbookSection: TopLevelResolver<MutationDeleteLogbookSectionArgs> = async (
  _,
  { id },
  { dataSources },
) => {
  await dataSources?.sections.deleteById(id);
  return true;
};

export default isAuthenticatedResolver(deleteLogbookSection);
