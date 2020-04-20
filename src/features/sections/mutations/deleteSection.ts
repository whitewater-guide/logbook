import { MutationDeleteSectionArgs } from '~/__generated__/graphql';
import { TopLevelResolver } from '~/apollo/types';

const deleteSection: TopLevelResolver<MutationDeleteSectionArgs> = async (
  _,
  { id },
  { dataSources },
) => {
  await dataSources?.sections.deleteById(id);
  return true;
};

export default deleteSection;
