import * as yup from 'yup';

import {
  isAuthenticatedResolver,
  isInputValidResolver,
} from '~/apollo/enhancedResolvers';

import { LogbookSectionInputSchema } from '../schema';
import { MutationUpsertLogbookSectionArgs } from '~/__generated__/graphql';
import { TopLevelResolver } from '~/apollo/types';

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
