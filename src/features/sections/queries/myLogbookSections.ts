import { QueryMyLogbookSectionsArgs } from '~/__generated__/graphql';
import { TopLevelResolver } from '~/apollo/types';

const myLogbookSections: TopLevelResolver<QueryMyLogbookSectionsArgs> = (
  _,
  { filter, page },
  { dataSources },
  info,
) => {
  return dataSources?.sections.getMany(info, filter, page);
};

export default myLogbookSections;
