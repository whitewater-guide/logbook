import {
  USER1_EXPIRED_JWT,
  USER1_INVALID_JWT,
  USER1_JWT,
  USER_1,
} from 'packages/server/src/test/fixtures';

import agent from 'supertest-koa-agent';
import { createApp } from './app';

it('should ping', async () => {
  const app = createApp();
  const resp = await agent(app).get('/ping');
  expect(resp).toMatchObject({
    status: 200,
    type: 'application/json',
    body: {
      success: true,
    },
  });
});

type JwtTestCase = [string, string, string | undefined];

it.each<JwtTestCase>([
  ['valid', USER1_JWT, USER_1],
  ['invalid', USER1_INVALID_JWT, undefined],
  ['expired', USER1_EXPIRED_JWT, undefined],
])('should return user from %s token', async (_, token, uid) => {
  const app = createApp();
  const resp = await agent(app)
    .get('/ping')
    .set('Authorization', `Bearer ${token}`);
  expect(resp).toMatchObject({
    status: 200,
    type: 'application/json',
    body: {
      success: true,
    },
  });
  if (uid) {
    expect(resp).toHaveProperty('body.uid', uid);
  } else {
    expect(resp).not.toHaveProperty('body.uid');
  }
});
