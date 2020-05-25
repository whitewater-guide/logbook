import {
  DatabasePoolConnectionType,
  DatabasePoolType,
  createPool,
} from 'slonik';

import { Client } from 'pg';

const cfg = {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  database: `logbook_test_${process.env.JEST_WORKER_ID}`,
  password: process.env.POSTGRES_PASSWORD,
};

let _pool: DatabasePoolType | undefined;

export const db: () => DatabasePoolConnectionType = () => {
  if (!_pool) {
    throw new Error('no test pool found');
  }
  return _pool;
};

export const setupDB = async () => {
  const workerID = process.env.JEST_WORKER_ID;
  if (!workerID) {
    throw new Error('JEST_WORKER_ID not found');
  }
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });
  try {
    await client.connect();
    await client.query(`DROP DATABASE IF EXISTS logbook_test_${workerID}`);
    await client.query(
      `CREATE DATABASE logbook_test_${workerID} TEMPLATE logbook_test_template`,
    );
  } finally {
    await client.end();
  }

  _pool = createPool(
    `postgresql://${cfg.user}:${cfg.password}@${cfg.host}/${cfg.database}`,
  );
};

export const teardownDB = async () => {
  await _pool?.end();
};
