import { setupDB, teardownDB } from '~/db';

import DescentFragments from '../descents.fragments';
import { gql } from 'apollo-server';

beforeEach(setupDB);
afterEach(teardownDB);

const mutation = gql`
  mutation upsertDescent($descent: DescentInput!, $shareToken: String) {
    upsertDescent(descent: $descent, shareToken: $shareToken) {
      ...descentAll
    }
  }
  ${DescentFragments.All}
`;
