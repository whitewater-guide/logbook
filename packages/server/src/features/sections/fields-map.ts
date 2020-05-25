import FieldsMap from 'packages/server/src/apollo/FieldsMap';
import { LogbookSection } from 'packages/server/src/__generated__/graphql';
import { SectionRaw } from 'packages/server/src/__generated__/sql';
import { sql } from 'slonik';

export const LogbookSectionFieldsMap = new FieldsMap<
  LogbookSection,
  SectionRaw
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
