import { gql } from 'apollo-server';

import { LogbookDescentsFilter } from '~/__generated__/graphql';
import { setupDB, teardownDB } from '~/db';
import { runQuery } from '~/test/apollo-helpers';
import {
  DESCENT_1,
  DESCENT_2,
  DESCENT_3,
  DESCENT_4,
  DESCENT_5,
  DESCENT_7,
  DESCENT_10,
  SECTION_1,
  SECTION_1_UPSTREAM,
  USER_1,
  USER_2,
} from '~/test/fixtures';

import {
  ListLogbookDescentsQuery,
  ListLogbookDescentsQueryVariables,
} from './logbookDescents.test.generated';

beforeEach(setupDB);
afterEach(teardownDB);

const query = gql`
  query listLogbookDescents($filter: LogbookDescentsFilter, $page: Page) {
    logbookDescents(filter: $filter, page: $page) {
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

const getIds = (result: ListLogbookDescentsQuery): string[] =>
  result.logbookDescents?.edges.map(({ node }) => node.id) || [];

it('should match snapshot', async () => {
  const result = await runQuery<
    ListLogbookDescentsQuery,
    ListLogbookDescentsQueryVariables
  >(query, {}, USER_1);
  expect(result).toMatchSnapshot();
});

it.each([
  ['anon should not see private sections', undefined, false],
  ['non-owner should not see private sections', USER_2, false],
  ['owner should see private sections', USER_1, true],
])('%s', async (_, uid, visible) => {
  const result = await runQuery<
    ListLogbookDescentsQuery,
    ListLogbookDescentsQueryVariables
  >(query, {}, uid);
  const actual = getIds(result.data).includes(DESCENT_2);
  expect(actual).toBe(visible);
});

type FilterTestCase = [string, LogbookDescentsFilter, string[]];
// use snapshot as a baseline
it.each<FilterTestCase>([
  ['difficulty', { difficulty: [2.5, 3] }, [DESCENT_7, DESCENT_3, DESCENT_2]],
  [
    'open date range',
    { startDate: new Date('2020-01-03T00:00:00.000Z').toISOString() as any },
    [DESCENT_7, DESCENT_5, DESCENT_3],
  ],
  [
    'closed date range',
    {
      startDate: new Date('2020-01-02T00:00:00.000Z').toISOString() as any,
      endDate: new Date('2020-01-05T00:00:00.000Z').toISOString() as any,
    },
    [DESCENT_5, DESCENT_3, DESCENT_2],
  ],
  [
    'user',
    {
      userID: USER_1,
    },
    [DESCENT_3, DESCENT_2, DESCENT_1],
  ],
  [
    'section id', // including derived sections
    {
      sectionID: SECTION_1,
    },
    [DESCENT_10, DESCENT_4, DESCENT_1],
  ],
  [
    'upstream section id',
    {
      upstreamSectionID: SECTION_1_UPSTREAM,
    },
    [DESCENT_10, DESCENT_4, DESCENT_1],
  ],
  [
    'section (full) name',
    {
      sectionName: 'oR',
    },
    [
      DESCENT_7,
      DESCENT_5,
      DESCENT_3,
      DESCENT_2,
      DESCENT_10,
      DESCENT_4,
      DESCENT_1,
    ],
  ],
])(
  `should filter and paginate by %s`,
  async (_, filter, [id1, id2, ...restIds]) => {
    let result = await runQuery<
      ListLogbookDescentsQuery,
      ListLogbookDescentsQueryVariables
    >(query, { filter, page: { limit: 1 } }, USER_1);
    expect(result.errors).toBeUndefined();
    expect(getIds(result.data)).toEqual([id1]);
    expect(result.data.logbookDescents?.pageInfo.hasMore).toBe(true);
    result = await runQuery<
      ListLogbookDescentsQuery,
      ListLogbookDescentsQueryVariables
    >(
      query,
      {
        filter,
        page: {
          limit: 1,
          after: result.data.logbookDescents?.pageInfo.endCursor,
        },
      },
      USER_1,
    );
    expect(result.errors).toBeUndefined();
    expect(getIds(result.data)).toEqual([id2]);
    expect(result.data.logbookDescents?.pageInfo.hasMore).toBe(true);
    result = await runQuery<
      ListLogbookDescentsQuery,
      ListLogbookDescentsQueryVariables
    >(
      query,
      {
        filter,
        page: {
          limit: 99,
          after: result.data.logbookDescents?.pageInfo.endCursor,
        },
      },
      USER_1,
    );
    expect(result.errors).toBeUndefined();
    expect(getIds(result.data)).toEqual(restIds);
    expect(result.data.logbookDescents?.pageInfo.hasMore).toBe(false);
  },
);
