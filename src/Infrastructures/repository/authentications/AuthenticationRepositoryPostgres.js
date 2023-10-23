const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');

/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  constructor({ pool }) {
    super();
    this.pool = pool;
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    /* const result = */
    await this.pool.query(query);
    // if (!result.rowCount) {
    //   throw new InvariantError('Gagal menambahakan token');
    // }
  }

  async verifyRefreshToken(token, messageError = 'refresh token tidak ditemukan di database') {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError(messageError);
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus token');
    }
  }
}

module.exports = AuthenticationRepositoryPostgres;
