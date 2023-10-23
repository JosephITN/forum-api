/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const CommentRepository = require('../../../../Domains/threads/comments/CommentRepository');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor({
    pool,
    idGenerator,
  }) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addComment(idThread, { content, now, creator }) {
    const id = `comment-${this.idGenerator()}`;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, "createdBy" as owner',
      values: [id, idThread, content, now, creator],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async editComment(id, { content, now, editor }) {
    const query = {
      text: 'UPDATE comments SET content = $1, "updatedAt" = $2, "updatedBy" = $3 WHERE id = $4 RETURNING id, content, "createdBy" as owner',
      values: [content, now, editor, id],
    };

    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui comment. Id tidak ditemukan');
    }

    return result.rows[0];
  }

  /**
   *
   * @param {string} creator
   * @returns {Promise<*>}
   */
  async getComments(creator) {
    const query = {
      text: 'SELECT id, content, "createdAt" as "date" FROM comments WHERE "createdBy" = $1 ORDER BY "createdAt"::timestamptz ASC',
      values: [creator],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  /**
   *
   * @param {string} idThread
   * @returns {Promise<*>}
   */
  async getCommentsByThreadId(idThread) {
    const query = {
      text: `SELECT comments.id as id, username, "createdAt" as "date", content, is_deleted as "isDeleted" FROM comments 
LEFT JOIN users ON comments."createdBy" = users.id WHERE "idThread" = $1 ORDER BY "createdAt"::timestamptz ASC`,
      values: [idThread],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async verifyCommentCreator(id, creator) {
    const query = {
      text: 'SELECT id, content, "createdAt", "createdBy" FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
    const comment = result.rows[0];
    if (comment.createdBy !== creator) {
      throw new AuthorizationError('Anda tidak berhak mengakses comment ini');
    }
  }

  async verifyCommentByThreadId(id, idThread) {
    const query = {
      text: 'SELECT id, content, "idThread", "createdAt" FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
    const comment = result.rows[0];
    if (comment.idThread !== idThread) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
  }

  async verifyCommentAvailability(id) {
    const query = {
      text: 'SELECT id, content, "createdAt", "createdBy" FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
  }

  /**
   *
   * @param {string} id
   * @returns {Promise<*>}
   */
  async getCommentById(id) {
    const query = {
      text: `SELECT comments.id as id, content, "createdAt" as "date", username FROM comments 
LEFT JOIN users ON comments."createdBy" = users.id WHERE comments.id = $1`,
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
    return result.rows[0];
  }

  async deleteComment(id) {
    const query = {
      text: 'DELETE FROM comments WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Comment gagal dihapus. Id tidak ditemukan');
    }
  }

  async deleteSoftComment(id, { now, deleter }) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true, "deletedAt" = $1, "deletedBy" = $2 WHERE id = $3 RETURNING id, content',
      values: [now, deleter, id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Comment gagal dihapus. Id tidak ditemukan');
    }
  }

  async deleteCommentByIdThread(idThread) {
    const query = {
      text: 'DELETE FROM comments WHERE "idThread" = $1 RETURNING id',
      values: [idThread],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Comment gagal dihapus. Id thread tidak ditemukan');
    }
  }

  async deleteSoftCommentByIdThread(idThread, { now, deleter }) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true, "deletedAt" = $1, "deletedBy" = $2 WHERE "idThread" = $3 RETURNING id, content',
      values: [now, deleter, idThread],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Comment gagal dihapus. Id thread tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
