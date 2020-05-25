import { FieldResolvers } from 'packages/server/src/apollo/types';
import { LogbookSection } from 'packages/server/src/__generated__/graphql';
import { Point } from '@turf/helpers';
import { SectionRaw } from 'packages/server/src/__generated__/sql';

const resolvePoint = (p: any) => {
  if (!p || typeof p !== 'string') {
    return null;
  }
  try {
    const pt: Point = JSON.parse(p);
    return {
      lat: pt.coordinates[1],
      lng: pt.coordinates[0],
    };
  } catch {
    return null;
  }
};

const fields: FieldResolvers<SectionRaw, LogbookSection> = {
  upstreamData: (d) => d.upstream_data || null,
  upstreamId: (d) => d.upstream_id || null,
  createdAt: (d) => new Date(d.created_at),
  updatedAt: (d) => new Date(d.updated_at),
  putIn: (d) => resolvePoint(d.put_in),
  takeOut: (d) => resolvePoint(d.take_out),
  difficulty: (d) => d.difficulty / 2,
  upstreamSection: (d) => ({ __typename: 'Section', id: d.upstream_id }),
  __resolveReference: ({ id }, { dataSources }, info) => {
    return dataSources?.sections.getOne(info, id);
  },
};

export default { LogbookSection: fields };
