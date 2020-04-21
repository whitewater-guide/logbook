import { MutationDeleteSectionArgs } from '~/__generated__/graphql';
import { TopLevelResolver } from '~/apollo/types';
import { isAuthenticatedResolver } from '~/apollo/enhancedResolvers';

const deleteSection: TopLevelResolver<MutationDeleteSectionArgs> = async (
  _,
  { id },
  { dataSources },
) => {
  await dataSources?.sections.deleteById(id);
  return true;
};

export default isAuthenticatedResolver(deleteSection);
