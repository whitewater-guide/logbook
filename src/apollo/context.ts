import * as koa from 'koa';

import type { TDescentsService } from '~/features/descents/descents.service';
import type { TSectionsService } from '~/features/sections/sections.service';
import get from 'lodash/get';

export interface Context {
  readonly uid?: string;
  readonly dataSources?: DataSources;
}

export interface DataSources {
  descents: TDescentsService;
  sections: TSectionsService;
}

interface Ctx {
  ctx: Partial<koa.Context>;
}

export const context = ({ ctx }: Ctx): Context => {
  const uid = get(ctx.state?.user, process.env.JWT_UID_KEY || 'sub');
  return { uid };
};
