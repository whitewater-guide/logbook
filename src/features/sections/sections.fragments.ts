import gql from 'graphql-tag';

const All = gql`
  fragment sectionAll on Section {
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

const SectionFragments = {
  All,
};

export default SectionFragments;
