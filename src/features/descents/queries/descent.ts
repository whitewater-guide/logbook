import { QueryDescentArgs } from '~/__generated__/graphql';
import { TopLevelResolver } from '~/apollo/types';

const descent: TopLevelResolver<QueryDescentArgs> = async (
  _,
  { id, shareToken },
  { dataSources },
  info,
) => {
  return dataSources?.descents.getOne(info, id, shareToken);
};

export default descent;
