import { FieldResolvers } from '~/apollo/types';
import { Section } from '~/__generated__/graphql';
import { SectionRaw } from '~/__generated__/sql';

const fields: FieldResolvers<SectionRaw, Section> = {
  upstreamData: (d) => d.upstream_data || null,
  upstreamId: (d) => d.upstream_id || null,
  createdAt: (d) => new Date(d.created_at),
  updatedAt: (d) => new Date(d.updated_at),
  difficulty: (d) => d.difficulty / 2,
};

export default { Section: fields };
