import {
  UpsertSectionMutation,
  UpsertSectionMutationVariables,
} from './upsertSection.test.generated';
import { setupDB, teardownDB } from '~/db';

import { SectionInput } from '~/__generated__/graphql';
import { USER_1 } from '~/test/fixtures';
import { gql } from 'apollo-server';
import { runQuery } from '~/test/apollo-helpers';

beforeEach(setupDB);
afterEach(teardownDB);

const mutation = gql`
  mutation upsertSection($section: SectionInput!) {
    upsertSection(section: $section) {
      id

      region
      river
      section
      difficulty
      putIn {
        lat
        lng
      }
      takeOut {
        lat
        lng
      }

      upstreamId
      upstreamData

      createdAt
      updatedAt
    }
  }
`;

const section: SectionInput = {
  region: 'Altai',
  river: 'Chuya',
  section: 'Mazhoy Gorge',
  difficulty: 5,
  putIn: { lat: 10, lng: 10 },
  takeOut: { lat: 20, lng: 20 },
  upstreamId: '__upstream_id__',
  upstreamData: { foo: 'bar ' },
};

it('should insert section', async () => {
  const result = await runQuery<
    UpsertSectionMutation,
    UpsertSectionMutationVariables
  >(mutation, { section }, USER_1);
  expect(result.errors).toBeUndefined();
  expect(result.data.upsertSection).toMatchSnapshot({
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    id: expect.any(String),
  });
});

it.todo('upsert with parent_id');
