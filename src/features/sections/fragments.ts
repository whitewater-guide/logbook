import gql from 'graphql-tag';

const All = gql`
  fragment logbookSectionAll on LogbookSection {
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
`;

const LogbookSectionFragments = {
  All,
};

export default LogbookSectionFragments;
