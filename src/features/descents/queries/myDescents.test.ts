import {
  ListMyDescentsQuery,
  ListMyDescentsQueryVariables,
} from './myDescents.test.generated';
import { setupDB, teardownDB } from '~/db';

import DescentFragments from '../descents.fragments';
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
          ...descentAll
        }
        cursor
      }
      pageInfo {
        endCursor
        hasMore
      }
    }
  }
  ${DescentFragments.All}
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
