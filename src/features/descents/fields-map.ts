import { Descent } from '~/__generated__/graphql';
import { DescentRaw } from '~/__generated__/sql';
import FieldsMap from '~/apollo/FieldsMap';

export const DescentFieldsMap = new FieldsMap<Descent, DescentRaw>([
  ['id', 'id'],
  ['section', 'section_id'],
  ['startedAt', 'started_at'],
  ['duration', 'duration'],
  ['level', ['level_unit', 'level_value']],
  ['comment', 'comment'],
  ['public', 'public'],
  ['upstreamData', 'upstream_data'],
  ['createdAt', 'created_at'],
  ['updatedAt', 'updated_at'],
]);
