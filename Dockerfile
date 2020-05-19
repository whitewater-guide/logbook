FROM node:12.16.3-alpine AS builder

WORKDIR /opt/app

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn codegen && yarn build

FROM node:12.16.3-alpine

WORKDIR /opt/app
RUN chown -R node:node /opt/app

USER node

COPY --chown=node:node --from=builder /opt/app/package.json /opt/app/yarn.lock /opt/app/schema.graphql ./
COPY --chown=node:node --from=builder /opt/app/dist ./dist

RUN yarn install --production --frozen-lockfile

ENTRYPOINT [ "node", "./dist/index.js" ]


