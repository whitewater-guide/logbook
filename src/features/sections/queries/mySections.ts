import { QueryMySectionsArgs } from '~/__generated__/graphql';
import { TopLevelResolver } from '~/apollo/types';

const mySections: TopLevelResolver<QueryMySectionsArgs> = (
  _,
  { filter, page },
  { dataSources },
  info,
) => {
  return dataSources?.sections.getMany(info, filter, page);
};

export default mySections;
