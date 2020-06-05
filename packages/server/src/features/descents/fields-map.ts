import { DescentRaw } from '~/__generated__/sql';
import FieldsMap from '~/apollo/FieldsMap';
import { LogbookDescent } from '~/__generated__/graphql';

export const LogbookDescentFieldsMap = new FieldsMap<
  LogbookDescent,
  DescentRaw
>([
  ['id', 'id'],
  ['userId', 'user_id'],
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
