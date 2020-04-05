import { DESCENT_1, DESCENT_2, USER_1, USER_2 } from '~/test/fixtures';
import {
  GetDescentQuery,
  GetDescentQueryVariables,
} from './descent.test.generated';
import { setupDB, teardownDB } from '~/db';

import { DESCENT_2_SHARE_TOKEN } from '../../../test/fixtures';
import { gql } from 'apollo-server';
import { runQuery } from '~/test/apollo-helpers';

beforeEach(setupDB);
afterEach(teardownDB);

const query = gql`
  query getDescent($id: ID, $shareToken: String) {
    descent(id: $id, shareToken: $shareToken) {
      id
      userId

      section {
        id

        region
        river
        section
        difficulty

        upstreamId
        upstreamData

        createdAt
        updatedAt
      }

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
    }
  }
`;

describe('permissions', () => {
  type PermissionsTestCase = [
    string,
    GetDescentQueryVariables,
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
    const result = await runQuery<GetDescentQuery, GetDescentQueryVariables>(
      query,
      vars,
      uid,
    );
    if (allowed) {
      expect(result.errors).toBeUndefined();
      expect(result.data?.descent).toBeTruthy();
    } else {
      expect(result.errors).toBeTruthy();
      expect(result.data?.descent).toBeNull();
    }
  });
});

it('should return descent', async () => {
  const result = await runQuery(query, { id: DESCENT_1 });
  expect(result.errors).toBeUndefined();
  expect(result.data!.descent).toMatchSnapshot();
});
