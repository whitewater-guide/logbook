#!/bin/sh

set -e

# This script:
# 1. Creates template database
# 2. Initializes schema and seeds data
# 3. Create N databases from this template, so that test can run in parallel, where N is number of cores

export PGPASSWORD=${POSTGRES_PASSWORD}
export PGHOST=${POSTGRES_HOST}
export PGUSER=${POSTGRES_USER}
export PGDATABASE=${POSTGRES_DB}

psql <<-EOSQL
  DROP DATABASE IF EXISTS logbook_test_template;
  CREATE DATABASE logbook_test_template;
  UPDATE pg_database SET datistemplate=false WHERE datname LIKE 'logbook_test_template';
EOSQL

psql -d logbook_test_template -c "create extension if not exists postgis"
psql -d logbook_test_template -c "create extension if not exists postgis_topology"
psql -d logbook_test_template -f sql/schema.sql
psql -d logbook_test_template -f sql/seeds.sql

# This code will stop execution unless argument is provided
# Because on codegen step we don't need to go further
if [ $# -eq 0 ]; then
    exit 0
fi

NUM_CORES=$(nproc)

i=0
while [ $NUM_CORES -gt $i ]; do
  psql -c "DROP DATABASE IF EXISTS logbook_test_${i};"
  psql -c "CREATE DATABASE logbook_test_${i} TEMPLATE logbook_test_template;"
  i=$(($i+1))
done
