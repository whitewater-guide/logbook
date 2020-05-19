import {
  DESCENT_1,
  DESCENT_4,
  SECTION_1,
  USER_1,
  USER_2,
} from '~/test/fixtures';
import {
  DeleteLogbookDescentMutation,
  DeleteLogbookDescentMutationVariables,
} from './deleteLogbookDescent.test.generated';
import { db, setupDB, teardownDB } from '~/db';

import { gql } from 'apollo-server';
import { runQuery } from '~/test/apollo-helpers';
import { sql } from 'slonik';

beforeEach(setupDB);
afterEach(teardownDB);

const mutation = gql`
  mutation deleteLogbookDescent($id: ID!) {
    deleteLogbookDescent(id: $id)
  }
`;

type PermissionsTestCase = [string, string | undefined, boolean];

it.each<PermissionsTestCase>([
  ['anon should not delete descent', undefined, false],
  ['non-owner should not delete descent', USER_2, false],
  ['owner should delete descent', USER_1, true],
])('%s', async (_, uid, allowed) => {
  const result = await runQuery<
    DeleteLogbookDescentMutation,
    DeleteLogbookDescentMutationVariables
  >(mutation, { id: DESCENT_1 }, uid);
  if (allowed) {
    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteLogbookDescent).toBe(true);
  } else {
    expect(result.errors).toBeTruthy();
    expect(result.data?.deleteLogbookDescent).toBeNull();
  }
});

it('should delete descent, keep section and nullify parent references', async () => {
  await runQuery<
    DeleteLogbookDescentMutation,
    DeleteLogbookDescentMutationVariables
  >(mutation, { id: DESCENT_1 }, USER_1);
  const noId = await db().maybeOneFirst(
    sql`SELECT id FROM logbook_descents WHERE id = ${DESCENT_1}`,
  );
  expect(noId).toBeNull();
  const secID = await db().maybeOneFirst(
    sql`SELECT id FROM logbook_sections WHERE id = ${SECTION_1}`,
  );
  expect(secID).toBe(SECTION_1);
  const parentId = await db().maybeOneFirst(
    sql`SELECT parent_id FROM logbook_descents WHERE id = ${DESCENT_4}`,
  );
  expect(parentId).toBeNull();
});
