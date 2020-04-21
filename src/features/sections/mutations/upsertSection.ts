import * as yup from 'yup';

import {
  isAuthenticatedResolver,
  isInputValidResolver,
} from '~/apollo/enhancedResolvers';

import { MutationUpsertSectionArgs } from '~/__generated__/graphql';
import { SectionInputSchema } from '../schema';
import { TopLevelResolver } from '~/apollo/types';

const Schema = yup.object<MutationUpsertSectionArgs>({
  section: SectionInputSchema.clone(),
});

const upsertSection: TopLevelResolver<MutationUpsertSectionArgs> = (
  _,
  { section },
  { dataSources },
  info,
) => {
  return dataSources?.sections.upsert(info, section);
};

export default isAuthenticatedResolver(
  isInputValidResolver(Schema, upsertSection),
);
