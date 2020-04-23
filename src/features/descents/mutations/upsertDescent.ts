import * as yup from 'yup';

import {
  isAuthenticatedResolver,
  isInputValidResolver,
} from '~/apollo/enhancedResolvers';

import { DescentInputSchema } from '../schema';
import { MutationUpsertDescentArgs } from '~/__generated__/graphql';
import { TopLevelResolver } from '~/apollo/types';

const Schema = yup.object<MutationUpsertDescentArgs>({
  descent: DescentInputSchema.clone().required(),
  shareToken: yup.string().notRequired().nullable(),
});

const upsertDescent: TopLevelResolver<MutationUpsertDescentArgs> = (
  _,
  { descent },
  { dataSources },
  info,
) => {
  return dataSources?.descents.upsert(info, descent);
};

export default isAuthenticatedResolver(
  isInputValidResolver(Schema, upsertDescent),
);
