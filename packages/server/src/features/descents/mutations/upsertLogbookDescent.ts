import { LogbookDescentInputSchema } from '@whitewater-guide/logbook-schema';
import * as yup from 'yup';

import { MutationUpsertLogbookDescentArgs } from '~/__generated__/graphql';
import {
  isAuthenticatedResolver,
  isInputValidResolver,
} from '~/apollo/enhancedResolvers';
import { TopLevelResolver } from '~/apollo/types';

const Schema = yup.object<MutationUpsertLogbookDescentArgs>({
  descent: LogbookDescentInputSchema.clone().required(),
  shareToken: yup.string().notRequired().nullable(),
});

const upsertLogbookDescent: TopLevelResolver<MutationUpsertLogbookDescentArgs> = (
  _,
  { descent, shareToken },
  { dataSources },
  info,
) => {
  return dataSources?.descents.upsert(info, descent, shareToken);
};

export default isAuthenticatedResolver(
  isInputValidResolver(Schema, upsertLogbookDescent),
);
