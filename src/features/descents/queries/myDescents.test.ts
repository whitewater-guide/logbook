import {
  ListMyDescentsQuery,
  ListMyDescentsQueryVariables,
} from './myDescents.test.generated';
import { setupDB, teardownDB } from '~/db';

import { USER_1 } from '~/test/fixtures';
import { gql } from 'apollo-server';
import { runQuery } from '~/test/apollo-helpers';

beforeEach(setupDB);
afterEach(teardownDB);

const query = gql`
  query listMyDescents($filter: DescentsFilter, $page: Page) {
    myDescents(filter: $filter, page: $page) {
      edges {
        node {
          id
          userId

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
    ListMyDescentsQuery,
    ListMyDescentsQueryVariables
  >(query, {}, USER_1);
  expect(result).toMatchSnapshot();
});

it('anon should fail', async () => {
  const result = await runQuery<
    ListMyDescentsQuery,
    ListMyDescentsQueryVariables
  >(query);
  expect(result.errors).toBeTruthy();
  expect(result.data.myDescents).toBeNull();
});
