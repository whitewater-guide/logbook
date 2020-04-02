import { setupDB, tearDownDB } from '~/test/db-helpers';

import { DESCENT_1 } from '~/test/fixtures';
import { gql } from 'apollo-server';
import { runQuery } from '~/test/apollo-helpers';

beforeEach(setupDB);
afterEach(tearDownDB);

const query = gql`
  query getDescent($id: ID, $shareToken: String) {
    descent(id: $id, shareToken: $shareToken) {
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
  }
`;

it('should return descent', async () => {
  const result = await runQuery(query, { id: DESCENT_1 });
  expect(result.errors).toBeUndefined();
  expect(result.data!.descent).toMatchSnapshot();
});
