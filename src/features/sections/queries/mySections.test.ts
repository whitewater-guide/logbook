import {
  ListMySectionsQuery,
  ListMySectionsQueryVariables,
} from './mySections.test.generated';
import {
  SECTION_1,
  SECTION_2,
  SECTION_3,
  USER_1,
  USER_2,
} from '~/test/fixtures';
import { setupDB, teardownDB } from '~/db';

import SectionFragments from '../sections.fragments';
import { SectionsFilter } from '~/__generated__/graphql';
import { gql } from 'apollo-server';
import { runQuery } from '~/test/apollo-helpers';

beforeEach(setupDB);
afterEach(teardownDB);

const getIds = (result: ListMySectionsQuery): string[] =>
  result.mySections?.edges.map(({ node }) => node.id) || [];

const query = gql`
  query listMySections($filter: SectionsFilter, $page: Page) {
    mySections(filter: $filter, page: $page) {
      edges {
        node {
          ...sectionAll
        }
        cursor
      }
      pageInfo {
        endCursor
        hasMore
      }
    }
  }
  ${SectionFragments.All}
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

type FilterTestCase = [string, SectionsFilter, string[]];
// use snapshot as a baseline
it.each<FilterTestCase>([
  ['difficulty', { difficulty: [2.5, 3] }, [SECTION_3, SECTION_2]],
  [
    'full name',
    {
      name: 'oR',
    },
    [SECTION_1, SECTION_3, SECTION_2],
  ],
])(
  `should filter and paginate by %s`,
  async (_, filter, [id1, id2, ...restIds]) => {
    let result = await runQuery<
      ListMySectionsQuery,
      ListMySectionsQueryVariables
    >(query, { filter, page: { limit: 1 } }, USER_1);
    expect(result.errors).toBeUndefined();
    expect(getIds(result.data)).toEqual([id1]);
    expect(result.data.mySections?.pageInfo.hasMore).toBe(true);
    result = await runQuery<ListMySectionsQuery, ListMySectionsQueryVariables>(
      query,
      {
        filter,
        page: { limit: 1, after: result.data.mySections?.pageInfo.endCursor },
      },
      USER_1,
    );
    expect(result.errors).toBeUndefined();
    expect(getIds(result.data)).toEqual([id2]);
    expect(result.data.mySections?.pageInfo.hasMore).toBe(!!restIds.length);
    result = await runQuery<ListMySectionsQuery, ListMySectionsQueryVariables>(
      query,
      {
        filter,
        page: { limit: 99, after: result.data.mySections?.pageInfo.endCursor },
      },
      USER_1,
    );
    expect(result.errors).toBeUndefined();
    expect(getIds(result.data)).toEqual(restIds);
    expect(result.data.mySections?.pageInfo.hasMore).toBe(false);
  },
);
