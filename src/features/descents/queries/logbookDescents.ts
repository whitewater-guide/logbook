import { QueryLogbookDescentsArgs } from '~/__generated__/graphql';
import { TopLevelResolver } from '~/apollo/types';

const descents: TopLevelResolver<QueryLogbookDescentsArgs> = (
  _,
  { filter, page },
  { dataSources },
  info,
) => {
  return dataSources?.descents.getMany(info, filter, page);
};

export default descents;
