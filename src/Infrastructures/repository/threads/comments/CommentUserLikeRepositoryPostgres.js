/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const CommentUserLikeRepository = require('../../../../Domains/threads/comments/CommentUserLikeRepository');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');

class CommentUserLikeRepositoryPostgres extends CommentUserLikeRepository {
  constructor({
    pool,
    idGenerator,
  }) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async getCommentLikes(idComment) {
    const query = {
      text: 'SELECT id, range, "createdAt" as "date", "userId" FROM comment_user_likes WHERE "commentId" = $1 ORDER BY "createdAt"::timestamptz ASC',
      values: [idComment],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getCommentLikeByIdCommentAndUser(idComment, idUser) {
    const query = {
      text: 'SELECT id, range, "createdAt" as "date" FROM comment_user_likes WHERE "commentId" = $1 and "userId" = $2 ORDER BY "createdAt"::timestamptz ASC',
      values: [idComment, idUser],
    };

    const result = await this.pool.query(query);

    // if (!result.rows.length) {
    //     throw new NotFoundError('Comment tidak ditemukan');
    // }
    return result.rows;
  }

  async addCommentLike(idComment, { now, liker, likes = 5 }) {
    const id = `comment-like-${this.idGenerator()}`;
    const query = {
      text: 'INSERT INTO comment_user_likes VALUES($1, $2, $3, $4, $5) RETURNING id, range, "userId" as owner',
      values: [id, idComment, liker, likes, now],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async deleteCommentLike(idComment, idUser) {
    const query = {
      text: 'DELETE FROM comment_user_likes WHERE "commentId" = $1 AND "userId" = $2 RETURNING id',
      values: [idComment, idUser],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal batal menyukai comment');
    }
  }
}

module.exports = CommentUserLikeRepositoryPostgres;
