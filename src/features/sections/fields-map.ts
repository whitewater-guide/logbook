import FieldsMap from '~/core/FieldsMap';
import { Section } from '~/__generated__/graphql';
import { SectionRaw } from '~/__generated__/sql';

export const SectionFieldsMap = new FieldsMap<Section, SectionRaw>([
  ['id', 'id'],
  ['region', 'region'],
  ['river', 'river'],
  ['section', 'section'],
  ['difficulty', 'difficulty'],
  ['upstreamId', 'upstream_id'],
  ['upstreamData', 'upstream_data'],
  ['createdAt', 'created_at'],
  ['updatedAt', 'updated_at'],
]);
