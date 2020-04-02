import { Client } from 'pg';
import db from '~/db';

// Use this to recreate database with fixtures before each test
export const setupDB = async (): Promise<void> => {
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
};

export const tearDownDB = async (): Promise<void> => {
  await db.end();
};
