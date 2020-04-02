declare module 'supertest-koa-agent' {
  import Koa from 'koa';
  // eslint-disable-next-line sort-imports
  import { SuperTest, Test } from 'supertest';

  type Agent = (app: Koa) => SuperTest<Test>;

  const agent: Agent;
  export default agent;
}
