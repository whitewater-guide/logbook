FROM node:12.18.0-alpine3.12

WORKDIR /opt/app
RUN chown -R node:node /opt/app

USER node

COPY --chown=node:node . .

RUN yarn install --production --frozen-lockfile

ENTRYPOINT [ "node", "./packages/server/dist/index.js" ]
