/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const InvariantError = require('../../../../../Commons/exceptions/InvariantError');
const ReplyRepository = require('../../../../../Domains/threads/comments/replies/ReplyRepository');
const NotFoundError = require('../../../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor({
    pool,
    idGenerator,
  }) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addReply(idComment, {
    idThread, idReply = null, content, now, creator,
  }) {
    const id = `reply-${this.idGenerator()}`;
    /* eslint-disable no-param-reassign */
    idReply = idReply || null;
    /* eslint-enable no-param-reassign */
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, "createdBy" as owner',
      values: [id, idThread, idComment, idReply, content, now, creator],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  /**
   *
   * @param {string} creator
   * @returns {Promise<*>}
   */
  async getReplies(creator) {
    const query = {
      text: `SELECT replies.id as id, content, "createdAt" as "date", username FROM replies 
LEFT JOIN users ON replies."createdBy" = users.id WHERE "createdBy" = $1`,
      values: [creator],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async editReply(id, { content, now, editor }) {
    const query = {
      text: 'UPDATE replies SET content = $1, "updatedAt" = $2, "updatedBy" = $3 WHERE id = $4 RETURNING id, content, "createdBy" as owner',
      values: [content, now, editor, id],
    };

    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui reply. Id tidak ditemukan');
    }
    return result.rows[0];
  }

  /**
   *
   * @param {string} idComment
   * @returns {Promise<*>}
   */
  async getRepliesByCommentId(idComment) {
    const query = {
      text: `SELECT replies.id as id, content, "createdAt" as "date", username, is_deleted as "isDeleted" FROM replies 
LEFT JOIN users ON replies."createdBy" = users.id WHERE "idComment" = $1 ORDER BY "createdAt"::timestamptz ASC`,
      values: [idComment],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  /**
   *
   * @param {string} idThread
   * @returns {Promise<*>}
   */
  async getRepliesByThreadId(idThread) {
    const query = {
      text: `SELECT replies.id as id, content, "createdAt" as "date", username FROM replies 
LEFT JOIN users ON replies."createdBy" = users.id WHERE "idThread" = $1 ORDER BY "createdAt"::timestamptz ASC`,
      values: [idThread],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async verifyReplyCreator(id, creator) {
    const query = {
      text: 'SELECT id, content, "createdAt", "createdBy" FROM replies WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
    const reply = result.rows[0];
    if (reply.createdBy !== creator) {
      throw new AuthorizationError('Anda tidak berhak mengakses reply ini');
    }
  }

  async verifyReplyByThreadId(id, idThread) {
    const query = {
      text: 'SELECT id, content, "idThread", "createdAt" FROM replies WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
    const comment = result.rows[0];
    if (comment.idThread !== idThread) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
  }

  async verifyReplyByCommentId(id, idComment) {
    const query = {
      text: 'SELECT id, content, "idComment", "createdAt" FROM replies WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
    const comment = result.rows[0];
    if (comment.idComment !== idComment) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
  }

  async verifyReplyAvailability(id) {
    const query = {
      text: 'SELECT id, content, "idComment", "createdAt" FROM replies WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
  }

  /**
   *
   * @param {string} id
   * @returns {Promise<*>}
   */
  async getReplyById(id) {
    const query = {
      text: `SELECT replies.id as id, content, "createdAt" as "date", username FROM replies 
LEFT JOIN users ON replies."createdBy" = users.id WHERE replies.id = $1`,
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('reply tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteReply(id) {
    const query = {
      text: 'DELETE FROM replies WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Reply gagal dihapus. Id tidak ditemukan');
    }
  }

  async deleteSoftReply(id, { now, deleter }) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true, "deletedAt" = $1, "deletedBy" = $2 WHERE id = $3 RETURNING id, content',
      values: [now, deleter, id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Reply gagal dihapus. Id tidak ditemukan');
    }
  }

  async deleteReplyByIdComment(idComment) {
    const query = {
      text: 'DELETE FROM replies WHERE "idComment" = $1 RETURNING id',
      values: [idComment],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Reply gagal dihapus. Id comment tidak ditemukan');
    }
  }

  async deleteSoftReplyByIdComment(idComment, { now, deleter }) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true, "deletedAt" = $1, "deletedBy" = $2 WHERE "idComment" = $3 RETURNING id, content',
      values: [now, deleter, idComment],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Reply gagal dihapus. Id comment tidak ditemukan');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
