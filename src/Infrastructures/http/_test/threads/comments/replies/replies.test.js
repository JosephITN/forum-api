/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const { pool } = require('../../../../../database/postgres/pool');
const container = require('../../../../../container');
const createServer = require('../../../../createServer');
const UsersTableTestHelper = require('../../../../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../../../../tests/RepliesTableTestHelper');
const PostgreSqlTestHelper = require('../../../../../../../tests/PostgreSqlTestHelper');

describe('/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    // await UsersTableTestHelper.truncate();
    // await AuthenticationsTableTestHelper.truncate();
    // await ThreadsTableTestHelper.truncate();
    // await CommentsTableTestHelper.truncate();
    // await RepliesTableTestHelper.truncate();
    await PostgreSqlTestHelper.runTransaction(async () => {
      await UsersTableTestHelper.deleteAll();
      await AuthenticationsTableTestHelper.deleteAll();
      await ThreadsTableTestHelper.deleteAll();
      await CommentsTableTestHelper.deleteAll();
      await RepliesTableTestHelper.deleteAll();
      // await PostgreSqlTestHelper.truncateAll()
    }, true);
  });
  describe('when POST /replies', () => {
    it('should response 200 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'reply content',
      };
      // Arrange
      const server = await createServer(container);
      // add user
      // await UsersTableTestHelper.addUser({
      //   id: 'user-123',
      //   username: 'admin',
      //   password: 'secret',
      //   fullname: 'Admin ForumAPI',
      // });
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
      expect(addedUser.id).toBeDefined();
      const idUser = addedUser.id;
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
      // add thread
      await ThreadsTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'admin',
        body: 'secret',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: idUser,
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: idUser,
      });
      const threadId = 'thread-123';
      // add comment
      await CommentsTableTestHelper.addComments({
        id: 'comment-123',
        idThread: 'thread-123',
        content: 'secret',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: idUser,
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: idUser,
      });
      const commentId = 'comment-123';
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
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
      expect(responseJson.data.addedReply)
        .toBeDefined();
      expect(responseJson.data.addedReply.id)
        .toBeDefined();
      expect(responseJson.data.addedReply.owner)
        .toBeDefined();
    });
  });
  describe('when PUT /replies', () => {
    it('should response 200 and persisted thread', async () => {
      // Arrange
      const requestPayloadStore = {
        content: 'reply content',
      };
      // Arrange
      const server = await createServer(container);
      // add user
      // await UsersTableTestHelper.addUser({
      //   id: 'user-123',
      //   username: 'admin',
      //   password: 'secret',
      //   fullname: 'Admin ForumAPI',
      // });
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
      expect(addedUser.id).toBeDefined();
      const idUser = addedUser.id;
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
      // add thread
      await ThreadsTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'admin',
        body: 'secret',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: idUser,
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: idUser,
      });
      const threadId = 'thread-123';
      // add comment
      await CommentsTableTestHelper.addComments({
        id: 'comment-123',
        idThread: 'thread-123',
        content: 'secret',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: idUser,
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: idUser,
      });
      const commentId = 'comment-123';
      // Action
      const responseStore = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
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
      expect(responseJsonStore.data)
        .toBeDefined();
      expect(responseJsonStore.data.addedReply)
        .toBeDefined();
      expect(responseJsonStore.data.addedReply.id)
        .toBeDefined();
      expect(responseJsonStore.data.addedReply.content)
        .toBeDefined();
      expect(responseJsonStore.data.addedReply.content).toEqual(requestPayloadStore.content);
      const replyId = responseJsonStore.data.addedReply.id;
      // Arrange
      const requestPayload = {
        content: 'reply content edited',
      };
      // update reply
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
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
      expect(responseJson.data.editedReply)
        .toBeDefined();
      expect(responseJson.data.editedReply.id)
        .toBeDefined();
      expect(responseJson.data.editedReply.content)
        .toBeDefined();
      expect(responseJson.data.editedReply.owner)
        .toBeDefined();
      expect(responseJson.data.editedReply.content).toEqual(requestPayload.content);
    });
  });
  describe('when DELETE /replies', () => {
    it('should response 200 and successfully delete thread', async () => {
      // Arrange
      const server = await createServer(container);
      // add user
      // await UsersTableTestHelper.addUser({
      //   id: 'user-123',
      //   username: 'admin',
      //   password: 'secret',
      //   fullname: 'Admin ForumAPI',
      // });
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
      expect(addedUser.id).toBeDefined();
      const idUser = addedUser.id;
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
      // add thread
      await ThreadsTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'admin',
        body: 'secret',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: idUser,
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: idUser,
      });
      const threadId = 'thread-123';
      // add comment
      await CommentsTableTestHelper.addComments({
        id: 'comment-123',
        idThread: 'thread-123',
        content: 'secret',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: idUser,
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: idUser,
      });
      const commentId = 'comment-123';
      // add reply
      await RepliesTableTestHelper.addReplies({
        id: 'reply-123',
        idThread: 'thread-123',
        idComment: 'comment-123',
        idReply: null,
        content: 'secret',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: idUser,
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: idUser,
      });
      const replyId = 'reply-123';
      // update reply
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
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
