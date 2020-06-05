import * as yup from 'yup';

import { LevelInput, LogbookDescentInput } from '~/__generated__/graphql';

import { LogbookSectionInputSchema } from '../sections/schema';
import { yupTypes } from '@whitewater-guide/validation';

export const LevelInputSchema = yup.object<LevelInput>({
  unit: yup.string().max(20).notRequired().nullable(),
  value: yup.number().required(),
});

export const LogbookDescentInputSchema = yup.object<LogbookDescentInput>({
  id: yupTypes.uuid(true, true),
  section: LogbookSectionInputSchema.clone().required(),
  startedAt: yup.date().required(),
  level: LevelInputSchema.clone().notRequired().nullable(),
  comment: yup.string().notRequired().nullable(),
  public: yup.bool().notRequired().nullable(),
  upstreamData: yup.object().notRequired().nullable(),
});
