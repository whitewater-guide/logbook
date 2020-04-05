import { QueryDescentsArgs } from '~/__generated__/graphql';
import { TopLevelResolver } from '~/apollo/types';

const descents: TopLevelResolver<QueryDescentsArgs> = (
  _,
  { filter, page },
  { dataSources },
  info,
) => {
  return dataSources?.descents.getMany(info, filter, page);
};

export default descents;
