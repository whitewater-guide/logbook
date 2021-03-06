import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { LevelInput, LogbookDescentInput } from '../__generated__/graphql';
import { LogbookSectionInputSchema } from '../sections/schema';

export const LevelInputSchema = yup.object<LevelInput>({
  unit: yup.string().max(20).notRequired().nullable(),
  value: yup.number().required(),
});

export const LogbookDescentInputSchema = yup.object<LogbookDescentInput>({
  id: yupTypes.uuid().notRequired().nullable(),
  section: LogbookSectionInputSchema.clone().required(),
  startedAt: yup.date().required() as any,
  duration: yup.number().integer().notRequired().nullable(),
  level: LevelInputSchema.clone().notRequired().nullable(),
  comment: yup.string().notRequired().nullable(),
  public: yup.bool().notRequired().nullable(),
  upstreamData: yup.object().notRequired().nullable(),
});
