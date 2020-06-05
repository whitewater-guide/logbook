import {
  LogbookDescentsFilter,
  QueryLogbookDescentsArgs,
} from '~/__generated__/graphql';

import { AuthenticationError } from 'apollo-server';
import { TopLevelResolver } from '~/apollo/types';

const myLogbookDescents: TopLevelResolver<QueryLogbookDescentsArgs> = (
  _,
  { filter, page },
  { dataSources, uid },
  info,
) => {
  if (!uid) {
    throw new AuthenticationError('unauthenticated');
  }
  const myFilter: LogbookDescentsFilter = { ...filter, userID: uid };
  return dataSources?.descents.getMany(info, myFilter, page);
};

export default myLogbookDescents;
