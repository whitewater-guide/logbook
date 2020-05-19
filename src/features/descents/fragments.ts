import LogbookSectionFragments from '../sections/fragments';
import gql from 'graphql-tag';

const AllButLogbookSection = gql`
  fragment logbookDescentAllButSection on LogbookDescent {
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
  }
`;

const All = gql`
  fragment logbookDescentAll on LogbookDescent {
    ...logbookDescentAllButSection
    section {
      ...logbookSectionAll
    }
  }
  ${AllButLogbookSection}
  ${LogbookSectionFragments.All}
`;

const LogbookDescentFragments = {
  All,
  AllButLogbookSection,
};

export default LogbookDescentFragments;
