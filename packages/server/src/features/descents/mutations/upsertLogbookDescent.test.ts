import {
  DESCENT_1,
  DESCENT_2,
  DESCENT_2_SHARE_TOKEN,
  DESCENT_4_SHARE_TOKEN,
  SECTION_1,
  SECTION_2,
  USER_1,
  USER_2,
} from '~/test/fixtures';
import {
  UpsertLogbookDescentMutation,
  UpsertLogbookDescentMutationVariables,
} from './upsertLogbookDescent.test.generated';
import { db, setupDB, teardownDB } from '~/db';

import { LogbookDescentInput } from '~/__generated__/graphql';
import { gql } from 'apollo-server';
import { runQuery } from '~/test/apollo-helpers';
import { sql } from 'slonik';

beforeEach(setupDB);
afterEach(teardownDB);

const mutation = gql`
  mutation upsertLogbookDescent(
    $descent: LogbookDescentInput!
    $shareToken: String
  ) {
    upsertLogbookDescent(descent: $descent, shareToken: $shareToken) {
      id
      userId

      startedAt
      duration
      level {
        value
        unit
      }
      comment
      public

      upstreamData

      createdAt
      updatedAt

      section {
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
  }
`;

const descent: LogbookDescentInput = {
  section: {
    region: 'Georgia',
    river: 'Bzhuzha',
    section: 'Lower',
    difficulty: 2,
  },
  startedAt: new Date(2000, 1, 1),
  duration: 3600,
  comment: 'comment',
  level: {
    value: 20,
    unit: 'cfs',
  },
  public: true,
  upstreamData: { foo: 'bar' },
};

it('anon should fail to insert descent', async () => {
  const result = await runQuery<
    UpsertLogbookDescentMutation,
    UpsertLogbookDescentMutationVariables
  >(mutation, { descent });
  expect(result.errors).toBeDefined();
  expect(result.data.upsertLogbookDescent).toBeNull();
});

it('non-owner should fail to update descent', async () => {
  const result = await runQuery<
    UpsertLogbookDescentMutation,
    UpsertLogbookDescentMutationVariables
  >(mutation, { descent: { ...descent, id: DESCENT_1 } }, USER_2);
  expect(result.errors).toBeDefined();
  expect(result.data.upsertLogbookDescent).toBeNull();
});

it('should fail on validation check', async () => {
  const badLogbookDescent: LogbookDescentInput = {
    section: {
      region: 'G',
      river: 'B',
      section: 'L',
      difficulty: 222,
    },
    startedAt: new Date(2000, 1, 1),
  };
  const result = await runQuery<
    UpsertLogbookDescentMutation,
    UpsertLogbookDescentMutationVariables
  >(mutation, { descent: badLogbookDescent }, USER_1);
  expect(result.errors?.[0]?.extensions).toMatchSnapshot({
    id: expect.any(String),
  });
  expect(result.data.upsertLogbookDescent).toBeNull();
});

it('should insert', async () => {
  const result = await runQuery<
    UpsertLogbookDescentMutation,
    UpsertLogbookDescentMutationVariables
  >(mutation, { descent }, USER_1);
  expect(result.errors).toBeUndefined();
  const { section, ...rest } = result.data.upsertLogbookDescent!;
  expect(section).toMatchSnapshot<any>({
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    id: expect.any(String),
  });
  expect(rest).toMatchSnapshot<any>({
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    id: expect.any(String),
  });
});

it('should update', async () => {
  const result = await runQuery<
    UpsertLogbookDescentMutation,
    UpsertLogbookDescentMutationVariables
  >(
    mutation,
    {
      descent: {
        ...descent,
        id: DESCENT_1,
        section: { ...descent.section, id: SECTION_1 },
      },
    },
    USER_1,
  );
  expect(result.errors).toBeUndefined();
  const { section, ...rest } = result.data.upsertLogbookDescent!;
  expect(section).toMatchSnapshot<any>({
    updatedAt: expect.any(Date),
  });
  expect(rest).toMatchSnapshot<any>({
    updatedAt: expect.any(Date),
  });
});

type ParentTestCase = [string, string, string, string];

it.each<ParentTestCase>([
  [' ', DESCENT_2_SHARE_TOKEN, DESCENT_2, SECTION_2],
  [' recursive ', DESCENT_4_SHARE_TOKEN, DESCENT_1, SECTION_1],
])(
  'should set%sparent references when token is provided',
  async (
    _,
    shareToken,
    expectedParentLogbookDescentId,
    expectedParentLogbookSectionId,
  ) => {
    const result = await runQuery<
      UpsertLogbookDescentMutation,
      UpsertLogbookDescentMutationVariables
    >(
      mutation,
      {
        descent,
        shareToken,
      },
      USER_2,
    );
    expect(result.errors).toBeUndefined();
    const id = result.data.upsertLogbookDescent?.id;
    const sectionId = result.data.upsertLogbookDescent?.section.id;
    const parentDescId = await db().oneFirst(
      sql`SELECT parent_id FROM logbook_descents WHERE id = ${id}`,
    );
    const parentLogbookSectionId = await db().oneFirst(
      sql`SELECT parent_id FROM logbook_sections WHERE id = ${sectionId}`,
    );
    expect(parentDescId).toBe(expectedParentLogbookDescentId);
    expect(parentLogbookSectionId).toBe(expectedParentLogbookSectionId);
  },
);
