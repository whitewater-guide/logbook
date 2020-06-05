import { QueryMyLogbookSectionArgs } from '~/__generated__/graphql';
import { TopLevelResolver } from '~/apollo/types';

const myLogbookSection: TopLevelResolver<QueryMyLogbookSectionArgs> = (
  _,
  { id },
  { dataSources },
  info,
) => {
  return dataSources?.sections.getOne(info, id);
};

export default myLogbookSection;
