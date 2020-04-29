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
  UpsertDescentMutation,
  UpsertDescentMutationVariables,
} from './upsertDescent.test.generated';
import { db, setupDB, teardownDB } from '~/db';

import DescentFragments from '../descents.fragments';
import { DescentInput } from '~/__generated__/graphql';
import { gql } from 'apollo-server';
import { runQuery } from '~/test/apollo-helpers';
import { sql } from 'slonik';

beforeEach(setupDB);
afterEach(teardownDB);

const mutation = gql`
  mutation upsertDescent($descent: DescentInput!, $shareToken: String) {
    upsertDescent(descent: $descent, shareToken: $shareToken) {
      ...descentAll
    }
  }
  ${DescentFragments.All}
`;

const descent: DescentInput = {
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
    UpsertDescentMutation,
    UpsertDescentMutationVariables
  >(mutation, { descent });
  expect(result.errors).toBeDefined();
  expect(result.data.upsertDescent).toBeNull();
});

it('non-owner should fail to update descent', async () => {
  const result = await runQuery<
    UpsertDescentMutation,
    UpsertDescentMutationVariables
  >(mutation, { descent: { ...descent, id: DESCENT_1 } }, USER_2);
  expect(result.errors).toBeDefined();
  expect(result.data.upsertDescent).toBeNull();
});

it('should fail on validation check', async () => {
  const badDescent: DescentInput = {
    section: {
      region: 'G',
      river: 'B',
      section: 'L',
      difficulty: 222,
    },
    startedAt: new Date(2000, 1, 1),
  };
  const result = await runQuery<
    UpsertDescentMutation,
    UpsertDescentMutationVariables
  >(mutation, { descent: badDescent }, USER_1);
  expect(result.errors?.[0]?.extensions).toMatchSnapshot({
    id: expect.any(String),
  });
  expect(result.data.upsertDescent).toBeNull();
});

it('should insert', async () => {
  const result = await runQuery<
    UpsertDescentMutation,
    UpsertDescentMutationVariables
  >(mutation, { descent }, USER_1);
  expect(result.errors).toBeUndefined();
  const { section, ...rest } = result.data.upsertDescent!;
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
    UpsertDescentMutation,
    UpsertDescentMutationVariables
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
  const { section, ...rest } = result.data.upsertDescent!;
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
  async (_, shareToken, expectedParentDescentId, expectedParentSectionId) => {
    const result = await runQuery<
      UpsertDescentMutation,
      UpsertDescentMutationVariables
    >(
      mutation,
      {
        descent,
        shareToken,
      },
      USER_2,
    );
    expect(result.errors).toBeUndefined();
    const id = result.data.upsertDescent?.id!;
    const sectionId = result.data.upsertDescent?.section.id!;
    const parentDescId = await db().oneFirst(
      sql`SELECT parent_id FROM descents WHERE id = ${id}`,
    );
    const parentSectionId = await db().oneFirst(
      sql`SELECT parent_id FROM sections WHERE id = ${sectionId}`,
    );
    expect(parentDescId).toBe(expectedParentDescentId);
    expect(parentSectionId).toBe(expectedParentSectionId);
  },
);
