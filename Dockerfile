FROM node:12.16.3-alpine AS builder

WORKDIR /opt/app

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn codegen && yarn build

FROM node:12.16.3-alpine

WORKDIR /opt/app
RUN chown -R node:node /opt/app

USER node

COPY --chown=node:node --from=builder /opt/app/packages/server/package.json /opt/app/packages/server/yarn.lock ./
COPY --chown=node:node --from=builder /opt/app/packages/server/dist ./dist

RUN yarn install --production --frozen-lockfile

ENTRYPOINT [ "node", "./packages/server/dist/index.js" ]


