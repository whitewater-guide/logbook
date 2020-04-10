import { DescentsFilter, QueryDescentsArgs } from '~/__generated__/graphql';

import { AuthenticationError } from 'apollo-server';
import { TopLevelResolver } from '~/apollo/types';

const myDescents: TopLevelResolver<QueryDescentsArgs> = (
  _,
  { filter, page },
  { dataSources, uid },
  info,
) => {
  if (!uid) {
    throw new AuthenticationError('unauthenticated');
  }
  const myFilter: DescentsFilter = { ...filter, userID: uid };
  return dataSources?.descents.getMany(info, myFilter, page);
};

export default myDescents;
