import {
  ListMySectionsQuery,
  ListMySectionsQueryVariables,
} from './mySections.test.generated';
import { USER_1, USER_2 } from '~/test/fixtures';
import { setupDB, teardownDB } from '~/db';

import { gql } from 'apollo-server';
import { runQuery } from '~/test/apollo-helpers';

beforeEach(setupDB);
afterEach(teardownDB);

const query = gql`
  query listMySections($filter: SectionsFilter, $page: Page) {
    mySections(filter: $filter, page: $page) {
      edges {
        node {
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
        cursor
      }
      pageInfo {
        endCursor
        hasMore
      }
    }
  }
`;

it('should match snapshot', async () => {
  const result = await runQuery<
    ListMySectionsQuery,
    ListMySectionsQueryVariables
  >(query, {}, USER_1);
  expect(result).toMatchSnapshot();
});

it.each([
  ['anon', undefined],
  ['other user', USER_2],
])('% should fail', async () => {
  const result = await runQuery<
    ListMySectionsQuery,
    ListMySectionsQueryVariables
  >(query);
  expect(result.errors).toBeTruthy();
  expect(result.data?.mySections).toBeNull();
});
