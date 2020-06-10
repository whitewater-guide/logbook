import { createPool, DatabasePoolConnectionType } from 'slonik';

const cfg = {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
};

const pool = createPool(
  `postgresql://${cfg.user}:${cfg.password}@${cfg.host}/${cfg.database}`,
);

export const db: () => DatabasePoolConnectionType = () => pool;
export const setupDB = () => Promise.resolve();
export const teardownDB = async () => {
  await pool.end();
};
