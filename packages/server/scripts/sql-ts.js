/* eslint-disable @typescript-eslint/no-var-requires */
const sqlts = require('@rmp135/sql-ts');
const path = require('path');
const fs = require('fs-extra');

const config = {
  dialect: 'postgres',
  connection: {
    host: process.env.POSTGRES_HOST || 'postgres.local',
    user: 'postgres',
    password: 'postgres',
    database: 'logbook_test_template',
  },
  schemas: ['public'],
  interfaceNameFormat: '${table}Raw',
  tableNameCasing: 'pascal',
  singularTableNames: true,
  typeMap: {
    Date: ['timestamptz'],
    '{[key: string]: any}': ['jsonb'],
  },
  typeOverrides: {
    'public.sections.difficulty': 'number',
  },
  template: path.resolve(__dirname, 'sql-ts.handlebars'),
};

sqlts
  .toTypeScript(config)
  .then((definitins) =>
    fs.writeFileSync(
      path.resolve(__dirname, '..', 'src/__generated__/sql.ts'),
      definitins,
    ),
  );
