import { MutationDeleteLogbookSectionArgs } from '~/__generated__/graphql';
import { isAuthenticatedResolver } from '~/apollo/enhancedResolvers';
import { TopLevelResolver } from '~/apollo/types';

const deleteLogbookSection: TopLevelResolver<MutationDeleteLogbookSectionArgs> = async (
  _,
  { id },
  { dataSources },
) => {
  await dataSources?.sections.deleteById(id);
  return true;
};

export default isAuthenticatedResolver(deleteLogbookSection);
