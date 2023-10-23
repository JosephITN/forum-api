/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const { pool } = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReplies({
    id = 'reply-123',
    idThread = 'thread-123',
    idComment = 'comment-123',
    idReply = null,
    content = 'comment reply',
    createdAt = '2023-09-26T18:59:54.813Z',
    createdBy = 'user-123',
    updatedAt = '2023-09-26T18:59:54.813Z',
    updatedBy = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      values: [
        id,
        idThread,
        idComment,
        idReply,
        content,
        createdAt,
        createdBy,
        updatedAt,
        updatedBy,
      ],
    };
    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async getRepliesByIdComment(idComment) {
    const query = {
      text: 'SELECT * FROM replies WHERE "idComment" = $1',
      values: [idComment],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async truncate() {
    await pool.query('TRUNCATE TABLE replies');
  },

  async deleteAll() {
    await pool.query('DELETE FROM replies');
  },
};

module.exports = RepliesTableTestHelper;
