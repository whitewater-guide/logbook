import { QueryMyLogbookSectionsArgs } from 'packages/server/src/__generated__/graphql';
import { TopLevelResolver } from 'packages/server/src/apollo/types';

const myLogbookSections: TopLevelResolver<QueryMyLogbookSectionsArgs> = (
  _,
  { filter, page },
  { dataSources },
  info,
) => {
  return dataSources?.sections.getMany(info, filter, page);
};

export default myLogbookSections;
