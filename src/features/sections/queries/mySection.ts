import { QueryMySectionArgs } from '~/__generated__/graphql';
import { TopLevelResolver } from '~/apollo/types';

const mySection: TopLevelResolver<QueryMySectionArgs> = (
  _,
  { id },
  { dataSources },
  info,
) => {
  return dataSources?.sections.getOne(info, id);
};

export default mySection;
