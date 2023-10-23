/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const { pool } = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComments({
    id = 'comment-123',
    idThread = 'thread-123',
    content = 'thread comment',
    createdAt = '2023-09-26T18:59:54.813Z',
    createdBy = 'user-123',
    updatedAt = '2023-09-26T18:59:54.813Z',
    updatedBy = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, idThread, content, createdAt, createdBy, updatedAt, updatedBy],
    };
    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async getCommentsByIdThread(idThread) {
    const query = {
      text: 'SELECT * FROM comments WHERE "idThread" = $1',
      values: [idThread],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async truncate() {
    await pool.query('TRUNCATE TABLE comments');
  },

  async deleteAll() {
    await pool.query('DELETE FROM comments');
  },
};

module.exports = CommentsTableTestHelper;
