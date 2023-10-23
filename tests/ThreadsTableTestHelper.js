/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const { pool } = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThreads({
    id = 'thread-123',
    title = 'thread title',
    body = 'thread body',
    createdAt = '2023-09-26T18:59:54.813Z',
    createdBy = 'user-123',
    updatedAt = '2023-09-26T18:59:54.813Z',
    updatedBy = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, title, body, createdAt, createdBy, updatedAt, updatedBy],
    };
    await pool.query(query);
  },

  async findThreadsById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async truncate() {
    await pool.query('TRUNCATE TABLE threads');
  },
  async deleteAll() {
    await pool.query('DELETE FROM threads');
  },
};

module.exports = ThreadsTableTestHelper;
