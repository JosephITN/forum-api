/*
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const { pool } = require('../src/Infrastructures/database/postgres/pool');

const CommentUserLikesTableTestHelper = {
  async addCommentLikes({
    id = 'comment-like-123',
    idComment = 'comment-123',
    idUser = 'user-123',
    range = 5,
    createdAt = '2023-09-26T18:59:54.813Z',
    updatedAt = '2023-09-26T18:59:54.813Z',
  }) {
    const query = {
      text: 'INSERT INTO comment_user_likes VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, idComment, idUser, range, createdAt, updatedAt],
    };
    await pool.query(query);
  },
  async findCommentLikesById(id) {
    const query = {
      text: 'SELECT * FROM comment_user_likes WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },
  async deleteAll() {
    await pool.query('DELETE FROM comment_user_likes');
  },
};

module.exports = CommentUserLikesTableTestHelper;
