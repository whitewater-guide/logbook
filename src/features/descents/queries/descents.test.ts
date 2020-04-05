import {
  ListDescentsQuery,
  ListDescentsQueryVariables,
} from './descents.test.generated';
import { setupDB, teardownDB } from '~/db';

import { gql } from 'apollo-server';
import { runQuery } from '~/test/apollo-helpers';

beforeEach(setupDB);
afterEach(teardownDB);

const query = gql`
  query listDescents($filter: DescentFilter, $page: Page) {
    descents(filter: $filter, page: $page) {
      edges {
        node {
          id

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
  const result = await runQuery<ListDescentsQuery, ListDescentsQueryVariables>(
    query,
  );
  expect(result).toMatchSnapshot();
});

it.todo('should omit private descents');
