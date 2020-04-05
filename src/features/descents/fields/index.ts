import { Descent } from '~/__generated__/graphql';
import { DescentRaw } from '~/__generated__/sql';
import { FieldResolvers } from '~/apollo/types';

const fields: FieldResolvers<DescentRaw, Descent> = {
  userId: (d) => d.user_id,
  startedAt: (d) => new Date(d.started_at),
  level: (d) => ({ unit: d.level_unit, value: d.level_value }),
  createdAt: (d) => new Date(d.created_at),
  updatedAt: (d) => new Date(d.updated_at),
  upstreamData: (d) => d.upstream_data,
};

export default { Descent: fields };
