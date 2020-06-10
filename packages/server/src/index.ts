/* eslint-disable @typescript-eslint/no-var-requires */
const moduleAlias = require('module-alias');
moduleAlias.addAlias('~', __dirname);
const startup = require('./startup').default;
const log = require('./log').default;

startup().catch((err: any) => {
  log.error(err);
  process.exit(1);
});
