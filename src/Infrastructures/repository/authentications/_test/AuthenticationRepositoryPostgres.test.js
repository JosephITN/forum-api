/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const Jwt = require('@hapi/jwt');
// const { nanoid } = require('nanoid');
const random = require('crypto');
const AuthenticationsTableTestHelper = require('../../../../../tests/AuthenticationsTableTestHelper');
const RegisterToken = require('../../../../Domains/authentications/entities/RegisterAuthenticationToken');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');
const { pool } = require('../../../database/postgres/pool');
const JwtTokenManager = require('../../../tokenizer/JwtTokenManager');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');
const PostgreSqlTestHelper = require('../../../../../tests/PostgreSqlTestHelper');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../../tests/RepliesTableTestHelper');

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    // await AuthenticationsTableTestHelper.truncate();
    await PostgreSqlTestHelper.runTransaction(async () => {
      await UsersTableTestHelper.deleteAll();
      await ThreadsTableTestHelper.deleteAll();
      await CommentsTableTestHelper.deleteAll();
      await RepliesTableTestHelper.deleteAll();
      // await PostgreSqlTestHelper.truncateAll()
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableToken function', () => {
    it('should throw InvariantError when token available', async () => {
      // Arrange
      const payload = { id: 'user-123' };
      const environments = {
        accessTokenKey: random.randomBytes(64)
          .toString('hex'),
        refreshTokenKey: random.randomBytes(64)
          .toString('hex'),
      };
      const jwtTokenManager = new JwtTokenManager({
        jwt: Jwt,
        accessTokenKey: environments.accessTokenKey,
        refreshTokenKey: environments.refreshTokenKey,
      });
      const refreshToken = jwtTokenManager.generateRefreshToken(payload);
      // memasukan token baru dengan token jwt
      await AuthenticationsTableTestHelper.addRefreshToken(refreshToken);
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres({ pool });

      // Action & Assert
      await expect(authenticationRepositoryPostgres.verifyRefreshToken(refreshToken))
        .resolves
        .not.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when token not available', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres({ pool });

      // Action & Assert
      await expect(authenticationRepositoryPostgres.verifyRefreshToken('admin'))
        .rejects
        .toThrowError(InvariantError);
    });
  });
  describe('addToken function', () => {
    it('should persist authentications token', async () => {
      // Arrange
      const payload = { id: 'user-123' };
      const environments = {
        accessTokenKey: random.randomBytes(64)
          .toString('hex'),
        refreshTokenKey: random.randomBytes(64)
          .toString('hex'),
      };
      const jwtTokenManager = new JwtTokenManager({
        jwt: Jwt,
        accessTokenKey: environments.accessTokenKey,
        refreshTokenKey: environments.refreshTokenKey,
      });
      const refreshToken = jwtTokenManager.generateRefreshToken(payload);
      // memasukan token baru dengan token jwt
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres({ pool });

      await authenticationRepositoryPostgres.addRefreshToken(refreshToken);

      // Action & Assert
      expect(() => new RegisterToken(refreshToken))
        .not
        .toThrowError('REGISTER_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION');
      const registerToken = new RegisterToken(refreshToken);
      expect(registerToken.token)
        .toEqual(refreshToken);
      const authentications = await AuthenticationsTableTestHelper.findRefreshToken(refreshToken);
      await expect(authentications)
        .toHaveLength(1);
    });
    it('should return refresh token', async () => {
      // Arrange
      const payload = { id: 'user-123' };
      const environments = {
        accessTokenKey: random.randomBytes(64)
          .toString('hex'),
        refreshTokenKey: random.randomBytes(64)
          .toString('hex'),
      };
      const jwtTokenManager = new JwtTokenManager({
        jwt: Jwt,
        accessTokenKey: environments.accessTokenKey,
        refreshTokenKey: environments.refreshTokenKey,
      });
      const refreshToken = jwtTokenManager.generateRefreshToken(payload);
      // memasukan token baru dengan token jwt
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres({ pool });

      await authenticationRepositoryPostgres.addRefreshToken(refreshToken);

      // Action & Assert
      expect(() => new RegisterToken(refreshToken))
        .not
        .toThrowError('REGISTER_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION');
      const registerToken = new RegisterToken(refreshToken);
      expect(registerToken.token)
        .not
        .toEqual(undefined);
      expect(registerToken.token)
        .toEqual(refreshToken);
      const authentications = await AuthenticationsTableTestHelper.findRefreshToken(refreshToken);
      await expect(authentications)
        .toHaveLength(1);
      await expect(authentications[0].token)
        .toStrictEqual(refreshToken);
    });
    // it('should throw InvariantError when adding null value as refresh token', async () => {
    //   // Arrange
    //   // memasukan token baru dengan token jwt
    //   const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres({ pool });
    //
    //   // Action & Assert
    //   await expect(authenticationRepositoryPostgres.addRefreshToken(null))
    //    .rejects.toThrowError(InvariantError);
    // });
  });
  describe('deleteToken function', () => {
    it('should not return expected token when successfully delete it', async () => {
      // Arrange
      const payload = { id: 'user-123' };
      const environments = {
        accessTokenKey: random.randomBytes(64)
          .toString('hex'),
        refreshTokenKey: random.randomBytes(64)
          .toString('hex'),
      };
      const jwtTokenManager = new JwtTokenManager({
        jwt: Jwt,
        accessTokenKey: environments.accessTokenKey,
        refreshTokenKey: environments.refreshTokenKey,
      });
      const refreshToken = jwtTokenManager.generateRefreshToken(payload);
      // memasukan token baru dengan token jwt
      await AuthenticationsTableTestHelper.addRefreshToken(refreshToken);
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres({ pool });

      // Action & Assert
      const deletedToken = await authenticationRepositoryPostgres.deleteRefreshToken(refreshToken);
      // console.log(`AuthenticationRepositoryPostgres.test:153 ${deletedToken}`);
      await expect(deletedToken)
        .toEqual(undefined);
    });
    it('should throw InvariantError token when failed to delete it', async () => {
      // Arrange
      const payload = { id: 'user-123' };
      const environments = {
        accessTokenKey: random.randomBytes(64)
          .toString('hex'),
        refreshTokenKey: random.randomBytes(64)
          .toString('hex'),
      };
      const jwtTokenManager = new JwtTokenManager({
        jwt: Jwt,
        accessTokenKey: environments.accessTokenKey,
        refreshTokenKey: environments.refreshTokenKey,
      });
      const refreshToken = jwtTokenManager.generateRefreshToken(payload);
      // skip adding
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres({ pool });

      // Action & Assert
      await expect(authenticationRepositoryPostgres.deleteRefreshToken(refreshToken))
        .rejects.toThrowError(InvariantError);
    });
  });
});
