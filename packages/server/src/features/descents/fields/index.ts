import { DescentRaw } from 'packages/server/src/__generated__/sql';
import { FieldResolvers } from 'packages/server/src/apollo/types';
import { LogbookDescent } from 'packages/server/src/__generated__/graphql';

const fields: FieldResolvers<DescentRaw, LogbookDescent> = {
  userId: (d) => d.user_id,
  startedAt: (d) => new Date(d.started_at),
  level: (d) => ({ unit: d.level_unit, value: d.level_value }),
  createdAt: (d) => new Date(d.created_at),
  updatedAt: (d) => new Date(d.updated_at),
  upstreamData: (d) => d.upstream_data,
  user: (d) => ({ __typename: 'User', id: d.user_id }),
  __resolveReference: ({ id }, { dataSources }, info) => {
    return dataSources?.descents.getOne(info, id);
  },
};

export default { LogbookDescent: fields };
