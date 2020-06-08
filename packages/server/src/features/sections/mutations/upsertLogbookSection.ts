import { LogbookSectionInputSchema } from '@whitewater-guide/logbook-schema';
import * as yup from 'yup';

import { MutationUpsertLogbookSectionArgs } from '~/__generated__/graphql';
import {
  isAuthenticatedResolver,
  isInputValidResolver,
} from '~/apollo/enhancedResolvers';
import { TopLevelResolver } from '~/apollo/types';

const Schema = yup.object<MutationUpsertLogbookSectionArgs>({
  section: LogbookSectionInputSchema.clone().required(),
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
