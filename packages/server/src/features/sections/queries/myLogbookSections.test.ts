import {
  ListMyLogbookSectionsQuery,
  ListMyLogbookSectionsQueryVariables,
} from './myLogbookSections.test.generated';
import {
  SECTION_1,
  SECTION_2,
  SECTION_3,
  USER_1,
  USER_2,
} from 'packages/server/src/test/fixtures';
import { setupDB, teardownDB } from 'packages/server/src/db';

import LogbookSectionFragments from '../fragments';
import { LogbookSectionsFilter } from 'packages/server/src/__generated__/graphql';
import { gql } from 'apollo-server';
import { runQuery } from 'packages/server/src/test/apollo-helpers';

beforeEach(setupDB);
afterEach(teardownDB);

const getIds = (result: ListMyLogbookSectionsQuery): string[] =>
  result.myLogbookSections?.edges.map(({ node }) => node.id) || [];

const query = gql`
  query listMyLogbookSections($filter: LogbookSectionsFilter, $page: Page) {
    myLogbookSections(filter: $filter, page: $page) {
      edges {
        node {
          ...logbookSectionAll
        }
        cursor
      }
      pageInfo {
        endCursor
        hasMore
      }
    }
  }
  ${LogbookSectionFragments.All}
`;

it('should match snapshot', async () => {
  const result = await runQuery<
    ListMyLogbookSectionsQuery,
    ListMyLogbookSectionsQueryVariables
  >(query, {}, USER_1);
  expect(result).toMatchSnapshot();
});

it.each([
  ['anon', undefined],
  ['other user', USER_2],
])('% should fail', async () => {
  const result = await runQuery<
    ListMyLogbookSectionsQuery,
    ListMyLogbookSectionsQueryVariables
  >(query);
  expect(result.errors).toBeTruthy();
  expect(result.data?.myLogbookSections).toBeNull();
});

type FilterTestCase = [string, LogbookSectionsFilter, string[]];
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
      ListMyLogbookSectionsQuery,
      ListMyLogbookSectionsQueryVariables
    >(query, { filter, page: { limit: 1 } }, USER_1);
    expect(result.errors).toBeUndefined();
    expect(getIds(result.data)).toEqual([id1]);
    expect(result.data.myLogbookSections?.pageInfo.hasMore).toBe(true);
    result = await runQuery<
      ListMyLogbookSectionsQuery,
      ListMyLogbookSectionsQueryVariables
    >(
      query,
      {
        filter,
        page: {
          limit: 1,
          after: result.data.myLogbookSections?.pageInfo.endCursor,
        },
      },
      USER_1,
    );
    expect(result.errors).toBeUndefined();
    expect(getIds(result.data)).toEqual([id2]);
    expect(result.data.myLogbookSections?.pageInfo.hasMore).toBe(
      !!restIds.length,
    );
    result = await runQuery<
      ListMyLogbookSectionsQuery,
      ListMyLogbookSectionsQueryVariables
    >(
      query,
      {
        filter,
        page: {
          limit: 99,
          after: result.data.myLogbookSections?.pageInfo.endCursor,
        },
      },
      USER_1,
    );
    expect(result.errors).toBeUndefined();
    expect(getIds(result.data)).toEqual(restIds);
    expect(result.data.myLogbookSections?.pageInfo.hasMore).toBe(false);
  },
);
