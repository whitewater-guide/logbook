import SectionFragments from '../sections/sections.fragments';
import gql from 'graphql-tag';

const AllButSection = gql`
  fragment descentAllButSection on Descent {
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
  fragment descentAll on Descent {
    ...descentAllButSection
    section {
      ...sectionAll
    }
  }
  ${AllButSection}
  ${SectionFragments.All}
`;

const DescentFragments = {
  All,
  AllButSection,
};

export default DescentFragments;
