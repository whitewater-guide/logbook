import { QueryLogbookDescentArgs } from 'packages/server/src/__generated__/graphql';
import { TopLevelResolver } from 'packages/server/src/apollo/types';

const descent: TopLevelResolver<QueryLogbookDescentArgs> = async (
  _,
  { id, shareToken },
  { dataSources },
  info,
) => {
  return dataSources?.descents.getOne(info, id, shareToken);
};

export default descent;
