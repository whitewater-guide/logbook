import { createPool, createTypeParserPreset } from 'slonik';

const cfg = {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  database:
    process.env.NODE_ENV === 'test'
      ? `logbook_test_${process.env.JEST_WORKER_ID}`
      : process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
};

const typeParsers = createTypeParserPreset().filter(
  ({ name }) => !['name', 'timestamp', 'timestamptz'].includes(name),
);

export const db = createPool(
  `postgresql://${cfg.user}:${cfg.password}@${cfg.host}/${cfg.database}`,
  {
    typeParsers,
  },
);
