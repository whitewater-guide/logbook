import * as yup from 'yup';

import {
  isAuthenticatedResolver,
  isInputValidResolver,
} from 'packages/server/src/apollo/enhancedResolvers';

import { LogbookSectionInputSchema } from '../schema';
import { MutationUpsertLogbookSectionArgs } from 'packages/server/src/__generated__/graphql';
import { TopLevelResolver } from 'packages/server/src/apollo/types';

const Schema = yup.object<MutationUpsertLogbookSectionArgs>({
  section: LogbookSectionInputSchema.clone(),
});

const upsertLogbookSection: TopLevelResolver<MutationUpsertLogbookSectionArgs> = (
  _,
  { section },
  { dataSources },
  info,
) => {
  return dataSources?.sections.upsert(info, section);
};

export default isAuthenticatedResolver(
  isInputValidResolver(Schema, upsertLogbookSection),
);
