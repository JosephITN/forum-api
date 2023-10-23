/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
/* istanbul ignore file */
const { Pool } = require('pg');
const config = require('../../utils/config');

const testConfig = {
  host: config.database['postgresql:test'].host,
  port: config.database['postgresql:test'].port,
  user: config.database['postgresql:test'].user,
  password: config.database['postgresql:test'].pass,
  database: config.database['postgresql:test'].database,
};

const pool = config.app.env === 'test' ? new Pool(testConfig) : new Pool();

module.exports = { pool, testConfig };
