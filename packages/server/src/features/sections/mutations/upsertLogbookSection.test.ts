import gql from 'graphql-tag';

import { LogbookSectionInput } from '~/__generated__/graphql';
import { setupDB, teardownDB } from '~/db';
import { expectTimestamp, runQuery } from '~/test/apollo-helpers';
import { SECTION_1, USER_1, USER_2 } from '~/test/fixtures';

import {
  UpsertLogbookSectionMutation,
  UpsertLogbookSectionMutationVariables,
} from './upsertLogbookSection.test.generated';

beforeEach(setupDB);
afterEach(teardownDB);

const mutation = gql`
  mutation upsertLogbookSection($section: LogbookSectionInput!) {
    upsertLogbookSection(section: $section) {
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

const section: LogbookSectionInput = {
  region: 'Altai',
  river: 'Chuya',
  section: 'Mazhoy Gorge',
  difficulty: 5,
  putIn: { lat: 10, lng: 10 },
  takeOut: { lat: 20, lng: 20 },
  upstreamId: '__upstream_id__',
  upstreamData: { foo: 'bar ' },
};

it('anon should fail to upsert section', async () => {
  const result = await runQuery<
    UpsertLogbookSectionMutation,
    UpsertLogbookSectionMutationVariables
  >(mutation, { section });
  expect(result.errors).toBeDefined();
  expect(result.data.upsertLogbookSection).toBeNull();
});

it('should fail validation check', async () => {
  const badLogbookSection: LogbookSectionInput = {
    region: 'A',
    river: 'C',
    section: 'M',
    difficulty: 15,
    putIn: { lat: 110, lng: 1000 },
    takeOut: { lat: 200, lng: 200 },
    upstreamId: '__upstream_id__',
    upstreamData: null,
  };
  const result = await runQuery<
    UpsertLogbookSectionMutation,
    UpsertLogbookSectionMutationVariables
  >(mutation, { section: badLogbookSection }, USER_1);
  expect(result.errors?.[0]?.extensions).toMatchSnapshot({
    id: expect.any(String),
  });
  expect(result.data.upsertLogbookSection).toBeNull();
});

it('should insert section', async () => {
  const result = await runQuery<
    UpsertLogbookSectionMutation,
    UpsertLogbookSectionMutationVariables
  >(mutation, { section }, USER_1);
  expect(result.errors).toBeUndefined();
  expect(result.data.upsertLogbookSection).toMatchSnapshot<any>({
    createdAt: expectTimestamp(),
    updatedAt: expectTimestamp(),
    id: expect.any(String),
  });
});

it('should update section', async () => {
  const result = await runQuery<
    UpsertLogbookSectionMutation,
    UpsertLogbookSectionMutationVariables
  >(mutation, { section: { ...section, id: SECTION_1 } }, USER_1);
  expect(result.errors).toBeUndefined();
  expect(result.data.upsertLogbookSection).toMatchSnapshot<any>({
    updatedAt: expectTimestamp(),
    id: SECTION_1,
  });
});

it('should fail to update other users section', async () => {
  const result = await runQuery<
    UpsertLogbookSectionMutation,
    UpsertLogbookSectionMutationVariables
  >(mutation, { section: { ...section, id: SECTION_1 } }, USER_2);
  expect(result.errors).toBeDefined();
  expect(result.data.upsertLogbookSection).toBeNull();
});
