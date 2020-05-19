import {
  ListMyLogbookDescentsQuery,
  ListMyLogbookDescentsQueryVariables,
} from './myLogbookDescents.test.generated';
import { setupDB, teardownDB } from '~/db';

import LogbookDescentFragments from '../fragments';
import { USER_1 } from '~/test/fixtures';
import { gql } from 'apollo-server';
import { runQuery } from '~/test/apollo-helpers';

beforeEach(setupDB);
afterEach(teardownDB);

const query = gql`
  query listMyLogbookDescents($filter: LogbookDescentsFilter, $page: Page) {
    myLogbookDescents(filter: $filter, page: $page) {
      edges {
        node {
          ...logbookDescentAll
        }
        cursor
      }
      pageInfo {
        endCursor
        hasMore
      }
    }
  }
  ${LogbookDescentFragments.All}
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
