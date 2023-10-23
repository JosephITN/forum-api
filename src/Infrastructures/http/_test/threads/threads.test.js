/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const { pool } = require('../../../database/postgres/pool');
const container = require('../../../container');
const createServer = require('../../createServer');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const PostgreSqlTestHelper = require('../../../../../tests/PostgreSqlTestHelper');
const CommentsTableTestHelper = require('../../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../../tests/RepliesTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    // await UsersTableTestHelper.truncate();
    // await AuthenticationsTableTestHelper.truncate();
    // await ThreadsTableTestHelper.truncate();
    await PostgreSqlTestHelper.runTransaction(async () => {
      await UsersTableTestHelper.deleteAll();
      await AuthenticationsTableTestHelper.deleteAll();
      await ThreadsTableTestHelper.deleteAll();
      await CommentsTableTestHelper.deleteAll();
      await RepliesTableTestHelper.deleteAll();
      // await PostgreSqlTestHelper.truncateAll()
    }, true);
  });
  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'thread title',
        body: 'thread body',
      };
      // Arrange
      const server = await createServer(container);
      // add user
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'admin',
          password: 'secret',
          fullname: 'Admin ForumAPI',
        },
      });
      const { data: { addedUser } } = JSON.parse(userResponse.payload);
      expect(addedUser).toBeDefined();
      expect(typeof addedUser).toBe('object');
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'admin',
          password: 'secret',
        },
      });
      const { data: { accessToken/* , refreshToken */ } } = JSON.parse(loginResponse.payload);
      expect(accessToken).toBeDefined();
      expect(typeof accessToken).toBe('string');
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      // if (response.statusCode !== 201) console.error(response, responseJson);
      expect(response.statusCode)
        .toEqual(201);
      expect(responseJson.status)
        .toEqual('success');
      expect(responseJson.data.addedThread)
        .toBeDefined();
      expect(responseJson.data.addedThread.id)
        .toBeDefined();
      expect(responseJson.data.addedThread.owner)
        .toBeDefined();
    });
  });
  describe('when GET /threads', () => {
    it('should response 200 and persisted thread', async () => {
      const requestPayloadStore = {
        title: 'thread title',
        body: 'thread body',
      };
      // Arrange
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'admin',
          password: 'secret',
          fullname: 'Admin ForumAPI',
        },
      });
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'admin',
          password: 'secret',
        },
      });
      const { data: { accessToken/* , refreshToken */ } } = JSON.parse(loginResponse.payload);
      // Action
      const responseStore = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadStore,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Assert
      const responseJsonStore = JSON.parse(responseStore.payload);
      // if (response.statusCode !== 201) console.error(response, responseJson);
      expect(responseStore.statusCode)
        .toEqual(201);
      expect(responseJsonStore.status)
        .toEqual('success');
      expect(responseJsonStore.data.addedThread)
        .toBeDefined();
      expect(responseJsonStore.data.addedThread.id)
        .toBeDefined();
      expect(responseJsonStore.data.addedThread.owner)
        .toBeDefined();

      const idThread = responseJsonStore.data.addedThread.id;

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${idThread}`,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode)
        .toEqual(200);
      expect(responseJson.status)
        .toEqual('success');
      expect(responseJson.data.thread)
        .toBeDefined();
      expect(responseJson.data.thread.id)
        .toBeDefined();
      expect(responseJson.data.thread.title)
        .toBeDefined();
      expect(responseJson.data.thread.body)
        .toBeDefined();
      expect(responseJson.data.thread.date)
        .toBeDefined();
      expect(responseJson.data.thread.username)
        .toBeDefined();
      expect(responseJson.data.thread.comments)
        .toBeDefined();
      const { comments } = responseJson.data.thread;
      expect(typeof comments)
        .toBe('object');
      expect(Object.keys(comments).length)
        .toEqual(0);
    });
  });
  describe('when PUT /threads', () => {
    it('should response 200 and persisted thread', async () => {
      const requestPayloadStore = {
        title: 'thread title',
        body: 'thread body',
      };
      // Arrange
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'admin',
          password: 'secret',
          fullname: 'Admin ForumAPI',
        },
      });
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'admin',
          password: 'secret',
        },
      });
      const { data: { accessToken/* , refreshToken */ } } = JSON.parse(loginResponse.payload);
      // Action
      const responseStore = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadStore,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Assert
      const responseJsonStore = JSON.parse(responseStore.payload);
      // if (response.statusCode !== 201) console.error(response, responseJson);
      expect(responseStore.statusCode)
        .toEqual(201);
      expect(responseJsonStore.status)
        .toEqual('success');
      expect(responseJsonStore.data.addedThread)
        .toBeDefined();
      expect(responseJsonStore.data.addedThread.id)
        .toBeDefined();
      expect(responseJsonStore.data.addedThread.owner)
        .toBeDefined();

      const idThread = responseJsonStore.data.addedThread.id;
      const requestPayload = {
        title: 'thread title newer',
        body: 'thread body newer',
      };
      // update thread
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${idThread}`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode)
        .toEqual(200);
      expect(responseJson.status)
        .toEqual('success');
      expect(responseJson.data.editedThread)
        .toBeDefined();
      expect(responseJson.data.editedThread.id)
        .toBeDefined();
      expect(responseJson.data.editedThread.title)
        .toBeDefined();
      expect(responseJson.data.editedThread.body)
        .toBeDefined();
      expect(responseJson.data.editedThread.owner)
        .toBeDefined();
      expect(responseJson.data.editedThread.title).toEqual(requestPayload.title);
      expect(responseJson.data.editedThread.body).toEqual(requestPayload.body);
    });
  });
  describe('when DELETE /threads', () => {
    it('should response 200 and successfully delete thread', async () => {
      // Arrange
      const server = await createServer(container);
      // add user
      /* const addedUser = */
      // await UsersTableTestHelper.addUser({
      //   id: 'user-123',
      //   username: 'admin',
      //   password: 'secret',
      //   fullname: 'Admin ForumAPI',
      // });
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'admin',
          password: 'secret',
          fullname: 'Admin ForumAPI',
        },
      });
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'admin',
          password: 'secret',
        },
      });
      const { data: { accessToken/* , refreshToken */ } } = JSON.parse(loginResponse.payload);
      // Action
      const responseStore = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread title',
          body: 'thread body',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Assert
      const responseJsonStore = JSON.parse(responseStore.payload);
      expect(responseStore.statusCode)
        .toEqual(201);
      expect(responseJsonStore.status)
        .toEqual('success');
      expect(responseJsonStore.data)
        .toBeDefined();
      expect(responseJsonStore.data.addedThread)
        .toBeDefined();
      const idThread = responseJsonStore.data.addedThread.id;
      // delete thread
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${idThread}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode)
        .toEqual(200);
      expect(responseJson.status)
        .toEqual('success');
    });
  });
});
