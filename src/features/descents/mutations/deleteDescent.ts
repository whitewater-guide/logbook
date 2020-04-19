import { MutationDeleteDescentArgs } from '~/__generated__/graphql';
import { TopLevelResolver } from '~/apollo/types';

const upsertDescent: TopLevelResolver<MutationDeleteDescentArgs> = async (
  _,
  { id },
  { dataSources },
) => {
  await dataSources?.descents.deleteById(id);
  return true;
};

export default upsertDescent;
