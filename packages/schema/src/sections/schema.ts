import * as yup from 'yup';

import { LatLngInput, LogbookSectionInput } from '../__generated__/graphql';

import { yupTypes } from '@whitewater-guide/validation';

export const LatLngInputSchema = yup.object<LatLngInput>({
  lat: yup.number().required().min(-90).max(90),
  lng: yup.number().required().min(-180).max(180),
});

export const LogbookSectionInputSchema = yup.object<LogbookSectionInput>({
  id: yupTypes.uuid(true, true),
  region: yup.string().required().min(2),
  river: yup.string().required().min(2),
  section: yup.string().required().min(2),
  difficulty: yup.number().min(0).max(6).required(),
  putIn: LatLngInputSchema.clone().nullable().notRequired(),
  takeOut: LatLngInputSchema.clone().nullable().notRequired(),
  upstreamId: yup.string().notRequired().nullable(),
  upstreamData: yup.object().notRequired().nullable(true),
});
