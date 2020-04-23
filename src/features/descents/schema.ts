import * as yup from 'yup';

import { DescentInput, LevelInput } from '~/__generated__/graphql';

import { SectionInputSchema } from '../sections/schema';
import { yupTypes } from '@whitewater-guide/validation';

export const LevelInputSchema = yup.object<LevelInput>({
  unit: yup.string().max(20).notRequired().nullable(),
  value: yup.number().required(),
});

export const DescentInputSchema = yup.object<DescentInput>({
  id: yupTypes.uuid(true, true),
  section: SectionInputSchema.clone().required(),
  startedAt: yup.date().required(),
  level: LevelInputSchema.clone().notRequired().nullable(),
  comment: yup.string().notRequired().nullable(),
  public: yup.bool().notRequired().nullable(),
  upstreamData: yup.object().notRequired().nullable(),
});
