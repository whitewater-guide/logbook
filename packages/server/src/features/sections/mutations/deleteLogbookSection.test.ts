import { gql } from 'apollo-server';
import { sql } from 'slonik';

import { db, setupDB, teardownDB } from '~/db';
import { runQuery } from '~/test/apollo-helpers';
import {
  DESCENT_1,
  DESCENT_4,
  SECTION_1,
  SECTION_4,
  USER_1,
  USER_2,
} from '~/test/fixtures';

import {
  DeleteLogbookSectionMutation,
  DeleteLogbookSectionMutationVariables,
} from './deleteLogbookSection.test.generated';

beforeEach(setupDB);
afterEach(teardownDB);

const mutation = gql`
  mutation deleteLogbookSection($id: ID!) {
    deleteLogbookSection(id: $id)
  }
`;

type PermissionsTestCase = [string, string | undefined, boolean];

it.each<PermissionsTestCase>([
  ['anon should not delete section', undefined, false],
  ['non-owner should not delete section', USER_2, false],
  ['owner should delete section', USER_1, true],
])('%s', async (_, uid, allowed) => {
  const result = await runQuery<
    DeleteLogbookSectionMutation,
    DeleteLogbookSectionMutationVariables
  >(mutation, { id: SECTION_1 }, uid);
  if (allowed) {
    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteLogbookSection).toBe(true);
  } else {
    expect(result.errors).toBeTruthy();
    expect(result.data?.deleteLogbookSection).toBeNull();
  }
});

it('should delete section, descents and nullify parent references', async () => {
  await runQuery<
    DeleteLogbookSectionMutation,
    DeleteLogbookSectionMutationVariables
  >(mutation, { id: SECTION_1 }, USER_1);
  // LogbookSection itself is deleted
  const noId = await db().maybeOneFirst(
    sql`SELECT id FROM logbook_sections WHERE id = ${SECTION_1}`,
  );
  expect(noId).toBeNull();
  // Cloned section remains, but parent_id is null
  const parentId = await db().maybeOneFirst(
    sql`SELECT parent_id FROM logbook_sections WHERE id = ${SECTION_4}`,
  );
  expect(parentId).toBeNull();
  // LogbookDescent of this section is deleted
  const descId = await db().maybeOneFirst(
    sql`SELECT id FROM logbook_descents WHERE id = ${DESCENT_1}`,
  );
  expect(descId).toBeNull();
  // Cloned descent of this section remains
  const parentDescId = await db().maybeOneFirst(
    sql`SELECT parent_id FROM logbook_descents WHERE id = ${DESCENT_4}`,
  );
  expect(parentDescId).toBeNull();
});
