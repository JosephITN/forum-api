/*
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  constructor({
    pool,
    idGenerator,
    bcryptPasswordHash,
  }) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
    this.bcryptPasswordHash = bcryptPasswordHash;
  }

  async addUser(registerUser) {
    const {
      username,
      password,
      fullname,
    } = registerUser;
    const id = `user-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    };

    const result = await this.pool.query(query);

    return new RegisteredUser({ ...result.rows[0] });
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    // console.error(typeof this.pool);
    const result = await this.pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async getUserByUsername(username) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('username tidak ditemukan');
    }

    return result.rows[0];
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this.pool.query(query);

    /**
         * Username existence
         */
    if (!result.rows.length) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }

    /**
         * Password comparison
         */
    const {
      id,
      password: hashedPassword,
    } = result.rows[0];
    const match = await this.bcryptPasswordHash.compare(password, hashedPassword);
    if (!match) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }
    return id;
  }
}

module.exports = UserRepositoryPostgres;
