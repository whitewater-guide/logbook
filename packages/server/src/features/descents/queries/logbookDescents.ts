import { QueryLogbookDescentsArgs } from 'packages/server/src/__generated__/graphql';
import { TopLevelResolver } from 'packages/server/src/apollo/types';

const descents: TopLevelResolver<QueryLogbookDescentsArgs> = (
  _,
  { filter, page },
  { dataSources },
  info,
) => {
  return dataSources?.descents.getMany(info, filter, page);
};

export default descents;
