import {
  MyLogbookSectionQuery,
  MyLogbookSectionQueryVariables,
} from './myLogbookSection.test.generated';
import { SECTION_1, USER_1, USER_2 } from '~/test/fixtures';
import { setupDB, teardownDB } from '~/db';

import LogbookSectionFragments from '../fragments';
import { gql } from 'apollo-server';
import { runQuery } from '~/test/apollo-helpers';

beforeEach(setupDB);
afterEach(teardownDB);

const query = gql`
  query myLogbookSection($id: ID!) {
    myLogbookSection(id: $id) {
      ...logbookSectionAll
    }
  }
  ${LogbookSectionFragments.All}
`;

describe('permissions', () => {
  type PermissionsTestCase = [string, string | undefined, boolean];

  it.each<PermissionsTestCase>([
    ['anon should not', undefined, false],
    ['other user should not', USER_2, false],
    ['owner should', USER_1, true],
  ])('%s get section', async (_, uid, allowed) => {
    const result = await runQuery<
      MyLogbookSectionQuery,
      MyLogbookSectionQueryVariables
    >(query, { id: SECTION_1 }, uid);
    if (allowed) {
      expect(result.errors).toBeUndefined();
      expect(result.data?.myLogbookSection).toBeTruthy();
    } else {
      expect(result.errors).toBeTruthy();
      expect(result.data?.myLogbookSection).toBeNull();
    }
  });
});

it('should return section', async () => {
  const result = await runQuery<
    MyLogbookSectionQuery,
    MyLogbookSectionQueryVariables
  >(query, { id: SECTION_1 }, USER_1);
  expect(result.errors).toBeUndefined();
  expect(result.data?.myLogbookSection).toMatchSnapshot();
});
