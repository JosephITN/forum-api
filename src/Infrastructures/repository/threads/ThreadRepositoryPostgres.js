/*
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
// const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
// const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
// const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor({
    pool,
    idGenerator,
  }) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addThread({
    title, body, now, creator,
  }) {
    const id = `thread-${this.idGenerator()}`;
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, body, "createdBy" as owner',
      values: [id, title, body, now, creator],
    };

    const result = await this.pool.query(query);

    // if (!result.rowCount) {
    //   throw new InvariantError('Thread gagal ditambahkan');
    // }
    return result.rows[0];
  }

  async editThread(id, {
    title, body, now, editor,
  }) {
    const query = {
      text: 'UPDATE threads SET title = $1, body = $2, "updatedAt" = $3, "updatedBy" = $4 WHERE id = $5 RETURNING id, title, body, "createdBy" as owner',
      values: [title, body, now, editor, id],
    };

    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui thread. Id tidak ditemukan');
    }
    return result.rows[0];
  }

  /**
   * Get all thread contents according to creator
   * @param creator
   * @returns {Promise<*>}
   */
  async getThreads(creator) {
    // let body = 'body';
    // if (deletedContent !== null && deletedContent !== '')
    //  body = `CASE WHEN is_deleted = true
    //  THEN '${deletedContent}' ELSE body END AS body`;
    const query = {
      text: 'SELECT id, title, body, "createdAt" as "date", is_deleted FROM threads WHERE "createdBy" = $1',
      values: [creator],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async verifyThreadCreator(id, creator) {
    const query = {
      text: 'SELECT id, title, body, "createdAt", "createdBy" FROM threads WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
    const thread = result.rows[0];
    if (thread.createdBy !== creator) {
      throw new AuthorizationError('Anda tidak berhak mengakses thread ini');
    }
  }

  async verifyThreadAvailability(id) {
    const query = {
      text: 'SELECT id, title, body, "createdAt", "createdBy" FROM threads WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }

  /**
   * Get thread according to its identifier
   * @param id
   * @returns {Promise<*>}
   */
  async getThreadById(id) {
    // let body = 'body';
    // if (deletedContent !== null && deletedContent !== '')
    //  body = `CASE WHEN is_deleted = true
    //  THEN '${deletedContent}' ELSE body END AS body`;
    const query = {
      text: `SELECT threads.id as id, title, body, "createdAt" as "date", username, is_deleted FROM threads 
LEFT JOIN users ON threads."createdBy" = users.id WHERE threads.id = $1`,
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
    return result.rows[0];
  }

  async deleteThread(id) {
    const query = {
      text: 'DELETE FROM threads WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Thread gagal dihapus. Id tidak ditemukan');
    }
  }

  async deleteSoftThread(id, { now, deleter }) {
    const query = {
      text: 'UPDATE threads SET is_deleted = true, "deletedAt" = $1, "deletedBy" = $2 WHERE id = $3 RETURNING id, body',
      values: [now, deleter, id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Thread gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
