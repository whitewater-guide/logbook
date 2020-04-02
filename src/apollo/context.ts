import * as koa from 'koa';

import type { TDescentsService } from '../features/descents/descents.service';

export interface Context {
  readonly uid?: string;
  readonly dataSources?: DataSources;
}

export interface DataSources {
  descents: TDescentsService;
}

interface Ctx {
  ctx: Partial<koa.Context>;
}

export const context = ({ ctx }: Ctx): Context => {
  return {};
};
