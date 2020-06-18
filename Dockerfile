FROM node:12.18.0-alpine3.12

WORKDIR /opt/app
RUN chown -R node:node /opt/app

USER node

COPY --chown=node:node . .

RUN yarn install --production --frozen-lockfile

WORKDIR /opt/app/packages/server

RUN rm -rf src \
 && rm -rf sql

ENTRYPOINT [ "node", "./dist/index.js" ]
