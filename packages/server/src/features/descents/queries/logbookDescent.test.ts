import { gql } from 'apollo-server';

import { setupDB, teardownDB } from '~/db';
import { runQuery } from '~/test/apollo-helpers';
import { DESCENT_1, DESCENT_2, USER_1, USER_2 } from '~/test/fixtures';

import { DESCENT_2_SHARE_TOKEN } from '../../../test/fixtures';
import {
  GetLogbookDescentQuery,
  GetLogbookDescentQueryVariables,
} from './logbookDescent.test.generated';

beforeEach(setupDB);
afterEach(teardownDB);

const query = gql`
  query getLogbookDescent($id: ID, $shareToken: String) {
    logbookDescent(id: $id, shareToken: $shareToken) {
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

describe('permissions', () => {
  type PermissionsTestCase = [
    string,
    GetLogbookDescentQueryVariables,
    string | undefined,
    boolean,
  ];

  it.each<PermissionsTestCase>([
    ['anon should get public descent', { id: DESCENT_1 }, undefined, true],
    [
      'anon should not get private descent',
      { id: DESCENT_2 },
      undefined,
      false,
    ],
    ['user should get public descent', { id: DESCENT_1 }, USER_1, true],
    ['user should get own private descent', { id: DESCENT_2 }, USER_1, true],
    [
      'user should not get other users private descent',
      { id: DESCENT_2 },
      USER_2,
      false,
    ],
    [
      'user should get other users private descent with share token',
      { shareToken: DESCENT_2_SHARE_TOKEN },
      USER_2,
      true,
    ],
    [
      'anon should not get other users private descent with share token',
      { shareToken: DESCENT_2_SHARE_TOKEN },
      undefined,
      false,
    ],
  ])('%s', async (_, vars, uid, allowed) => {
    const result = await runQuery<
      GetLogbookDescentQuery,
      GetLogbookDescentQueryVariables
    >(query, vars, uid);
    if (allowed) {
      expect(result.errors).toBeUndefined();
      expect(result.data?.logbookDescent).toBeTruthy();
    } else {
      expect(result.errors).toBeTruthy();
      expect(result.data?.logbookDescent).toBeNull();
    }
  });
});

it('should return descent', async () => {
  const result = await runQuery<
    GetLogbookDescentQuery,
    GetLogbookDescentQueryVariables
  >(query, { id: DESCENT_1 });
  expect(result.errors).toBeUndefined();
  expect(result.data?.logbookDescent).toMatchSnapshot();
});

it('should return null when no id is provided', async () => {
  const result = await runQuery<
    GetLogbookDescentQuery,
    GetLogbookDescentQueryVariables
  >(query, {});
  expect(result.errors).toBeUndefined();
  expect(result.data?.logbookDescent).toBeNull();
});
