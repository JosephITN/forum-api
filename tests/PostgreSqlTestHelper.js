/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const { pool } = require('../src/Infrastructures/database/postgres/pool');
const { runTransaction: _runTransaction } = require('../src/Infrastructures/utils/helpers');

const PostgreSqlTestHelper = {
  // async beginTransaction() {
  //   await pool.query('BEGIN');
  // },
  // async commitTransaction() {
  //   await pool.query('COMMIT');
  // },
  // async rollbackTransaction() {
  //   await pool.query('ROLLBACK');
  // },
  // async setTransactionSerializable() {
  //   await pool.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');
  // },
  // async truncateAll() {
  //   await pool.query('TRUNCATE replies, comments, threads, users, authentications');
  // },
  async runTransaction(transactionCallback, useSerializableIsolation = false) {
    return _runTransaction(pool, transactionCallback, useSerializableIsolation);
  },
};

module.exports = PostgreSqlTestHelper;
