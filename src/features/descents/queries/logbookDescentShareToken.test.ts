import { DESCENT_2, USER_1, USER_2 } from '~/test/fixtures';
import {
  GetShareTokenQuery,
  GetShareTokenQueryVariables,
} from './logbookDescentShareToken.test.generated';
import { setupDB, teardownDB } from '~/db';

import { DESCENT_2_SHARE_TOKEN } from '../../../test/fixtures';
import { gql } from 'apollo-server';
import { runQuery } from '~/test/apollo-helpers';

beforeEach(setupDB);
afterEach(teardownDB);

const query = gql`
  query getShareToken($id: ID!) {
    logbookDescentShareToken(id: $id)
  }
`;

type PermissionsTestCase = [string, string | undefined, boolean];

it.each<PermissionsTestCase>([
  ['anon', undefined, false],
  ['non-owner', USER_2, false],
])('%s should not get share token', async (_, uid, allowed) => {
  const result = await runQuery<
    GetShareTokenQuery,
    GetShareTokenQueryVariables
  >(query, { id: DESCENT_2 }, uid);
  if (allowed) {
    expect(result.errors).toBeUndefined();
    expect(result.data?.logbookDescentShareToken).toBeTruthy();
  } else {
    expect(result.errors).toBeTruthy();
    expect(result.data?.logbookDescentShareToken).toBeNull();
  }
});

it('should return descent share token', async () => {
  const result = await runQuery<
    GetShareTokenQuery,
    GetShareTokenQueryVariables
  >(query, { id: DESCENT_2 }, USER_1);
  expect(result.errors).toBeUndefined();
  expect(result.data?.logbookDescentShareToken).toEqual(DESCENT_2_SHARE_TOKEN);
});
