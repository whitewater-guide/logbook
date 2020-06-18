import { gql } from 'apollo-server';

import { setupDB, teardownDB } from '~/db';
import { runQuery } from '~/test/apollo-helpers';
import { USER_1 } from '~/test/fixtures';

import {
  ListMyLogbookDescentsQuery,
  ListMyLogbookDescentsQueryVariables,
} from './myLogbookDescents.test.generated';

beforeEach(setupDB);
afterEach(teardownDB);

const query = gql`
  query listMyLogbookDescents(
    $filter: LogbookDescentsFilter
    $page: PageInput
  ) {
    myLogbookDescents(filter: $filter, page: $page) {
      edges {
        node {
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
    ListMyLogbookDescentsQuery,
    ListMyLogbookDescentsQueryVariables
  >(query, {}, USER_1);
  expect(result).toMatchSnapshot();
});

it('anon should fail', async () => {
  const result = await runQuery<
    ListMyLogbookDescentsQuery,
    ListMyLogbookDescentsQueryVariables
  >(query);
  expect(result.errors).toBeTruthy();
  expect(result.data.myLogbookDescents).toBeNull();
});
