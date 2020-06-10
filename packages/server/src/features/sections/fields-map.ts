import { sql } from 'slonik';

import { LogbookSection } from '~/__generated__/graphql';
import { LogbookSectionRaw } from '~/__generated__/sql';
import FieldsMap from '~/apollo/FieldsMap';

export const LogbookSectionFieldsMap = new FieldsMap<
  LogbookSection,
  LogbookSectionRaw
>([
  ['id', 'id'],
  ['region', 'region'],
  ['river', 'river'],
  ['section', 'section'],
  ['difficulty', 'difficulty'],
  ['upstreamId', 'upstream_id'],
  ['putIn', { raw: sql`ST_AsGeoJSON(put_in)`, alias: 'put_in' }],
  ['takeOut', { raw: sql`ST_AsGeoJSON(take_out)`, alias: 'take_out' }],
  ['upstreamData', 'upstream_data'],
  ['createdAt', 'created_at'],
  ['updatedAt', 'updated_at'],
]);
