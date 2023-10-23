/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const { pool } = require('../../database/postgres/pool');
const { getInstance } = require('../../utils/helpers');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const JwtTokenManager = require('../../tokenizer/JwtTokenManager');
const PostgreSqlTestHelper = require('../../../../tests/PostgreSqlTestHelper');

describe('/authentications endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.deleteAll();
    await AuthenticationsTableTestHelper.deleteAll();
    // await AuthenticationsTableTestHelper.truncate();
    // await PostgreSqlTestHelper.truncateAll();
  });
  describe('when POST /authentications', () => {
    it('should response 201 and new authentication', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const server = await createServer(container);
      // add user
      /* const responseAddUser =  */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // expect(responseAddUser.statusCode).toEqual(201);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      // if (response.statusCode !== 201) console.error(response, responseJson);
      expect(response.statusCode)
        .toEqual(201);
      expect(responseJson.status)
        .toEqual('success');
      expect(responseJson.data.accessToken)
        .toBeDefined();
      expect(responseJson.data.refreshToken)
        .toBeDefined();
    });

    it('should response 400 if username not found', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      // if (response.statusCode !== 400) console.error(response, responseJson);
      expect(response.statusCode)
        .toEqual(400);
      expect(responseJson.status)
        .toEqual('fail');
      expect(responseJson.message)
        .toEqual('username tidak ditemukan');
      // .toEqual('kredensial yang Anda masukkan salah');
    });

    it('should response 401 if password wrong', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'wrong_password',
      };
      const server = await createServer(container);
      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      // if (response.statusCode !== 401) console.error(response, responseJson);
      expect(response.statusCode)
        .toEqual(401);
      expect(responseJson.status)
        .toEqual('fail');
      expect(responseJson.message)
        .toEqual('kredensial yang Anda masukkan salah');
    });

    it('should response 400 if login payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      // if (response.statusCode !== 400) console.error(response, responseJson);
      expect(response.statusCode)
        .toEqual(400);
      expect(responseJson.status)
        .toEqual('fail');
      expect(responseJson.message)
        .toEqual('harus mengirimkan username dan password');
    });

    it('should response 400 if login payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        username: 123,
        password: 'secret',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      // if (response.statusCode !== 400) console.error(response, responseJson);
      expect(response.statusCode)
        .toEqual(400);
      expect(responseJson.status)
        .toEqual('fail');
      expect(responseJson.message)
        .toEqual('username dan password harus string');
    });
  });
  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      // Arrange
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { refreshToken } } = JSON.parse(loginResponse.payload);
      expect(refreshToken).toBeDefined();
      expect(typeof refreshToken).toBe('string');
      // console.log(JSON.parse(loginResponse.payload), refreshToken);
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      const responseJson = JSON.parse(response.payload);
      // if (response.statusCode !== 200) console.error(response, responseJson);
      expect(response.statusCode)
        .toEqual(200);
      expect(responseJson.status)
        .toEqual('success');
      expect(responseJson.data.accessToken)
        .toBeDefined();
    });

    it('should return 400 payload not contain refresh token', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {},
      });

      const responseJson = JSON.parse(response.payload);
      // if (response.statusCode !== 400) console.error(response, responseJson);
      expect(response.statusCode)
        .toEqual(400);
      expect(responseJson.status)
        .toEqual('fail');
      expect(responseJson.message)
        .toEqual('harus mengirimkan token refresh');
    });

    it('should return 400 if refresh token not string', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: 123,
        },
      });

      const responseJson = JSON.parse(response.payload);
      // if (response.statusCode !== 400) console.error(responseJson);
      expect(response.statusCode)
        .toEqual(400);
      expect(responseJson.status)
        .toEqual('fail');
      expect(responseJson.message)
        .toEqual('refresh token harus string');
    });

    it('should return 400 if refresh token not valid', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: 'invalid_refresh_token',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      // if (response.statusCode !== 400) console.error(responseJson);
      expect(response.statusCode)
        .toEqual(400);
      expect(responseJson.status)
        .toEqual('fail');
      expect(responseJson.message)
        .toEqual('refresh token tidak valid');
    });

    it('should return 400 if refresh token not registered in database', async () => {
      // Arrange
      const server = await createServer(container);
      // const refreshToken = await container.getInstance(
      //  AuthenticationTokenManager.name
      // ).createRefreshToken({ username: 'dicoding' });
      const refreshToken = await container.resolve(getInstance(JwtTokenManager.name))
        .generateRefreshToken({ username: 'dicoding' });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      // if (response.statusCode !== 400) console.error(responseJson);
      expect(response.statusCode)
        .toEqual(400);
      expect(responseJson.status)
        .toEqual('fail');
      expect(responseJson.message)
        .toEqual('refresh token tidak valid');
    });
  });
  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      // Arrange
      const server = await createServer(container);
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addRefreshToken(refreshToken);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      // if (response.statusCode !== 200) console.error(responseJson);
      expect(response.statusCode)
        .toEqual(200);
      expect(responseJson.status)
        .toEqual('success');
    });

    it('should response 400 if refresh token not registered in database', async () => {
      // Arrange
      const server = await createServer(container);
      const refreshToken = 'refresh_token';

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      // if (response.statusCode !== 400) console.error(responseJson);
      expect(response.statusCode)
        .toEqual(400);
      expect(responseJson.status)
        .toEqual('fail');
      expect(responseJson.message)
        .toEqual('refresh token tidak ditemukan di database');
    });

    it('should response 400 if payload not contain refresh token', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {},
      });

      const responseJson = JSON.parse(response.payload);
      // if (response.statusCode !== 400) console.error(responseJson);
      expect(response.statusCode)
        .toEqual(400);
      expect(responseJson.status)
        .toEqual('fail');
      expect(responseJson.message)
        .toEqual('harus mengirimkan token refresh');
    });

    it('should response 400 if refresh token not string', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: 123,
        },
      });

      const responseJson = JSON.parse(response.payload);
      // if (response.statusCode !== 400) console.error(response, responseJson);
      expect(response.statusCode)
        .toEqual(400);
      expect(responseJson.status)
        .toEqual('fail');
      expect(responseJson.message)
        .toEqual('refresh token harus string');
    });
  });
});
