import { QueryMyLogbookSectionArgs } from 'packages/server/src/__generated__/graphql';
import { TopLevelResolver } from 'packages/server/src/apollo/types';

const myLogbookSection: TopLevelResolver<QueryMyLogbookSectionArgs> = (
  _,
  { id },
  { dataSources },
  info,
) => {
  return dataSources?.sections.getOne(info, id);
};

export default myLogbookSection;
