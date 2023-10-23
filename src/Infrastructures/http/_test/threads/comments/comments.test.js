/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const { pool } = require('../../../../database/postgres/pool');
const container = require('../../../../container');
const createServer = require('../../../createServer');
const UsersTableTestHelper = require('../../../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../../../tests/CommentsTableTestHelper');
const CommentUserLikesTableTestHelper = require('../../../../../../tests/CommentUserLikesTableTestHelper');
const PostgreSqlTestHelper = require('../../../../../../tests/PostgreSqlTestHelper');
const RepliesTableTestHelper = require('../../../../../../tests/RepliesTableTestHelper');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    // await UsersTableTestHelper.truncate();
    // await AuthenticationsTableTestHelper.truncate();
    // await ThreadsTableTestHelper.truncate();
    // await CommentsTableTestHelper.truncate();
    await PostgreSqlTestHelper.runTransaction(async () => {
      await UsersTableTestHelper.deleteAll();
      await AuthenticationsTableTestHelper.deleteAll();
      await ThreadsTableTestHelper.deleteAll();
      await CommentsTableTestHelper.deleteAll();
      await CommentUserLikesTableTestHelper.deleteAll();
      await RepliesTableTestHelper.deleteAll();
      // await PostgreSqlTestHelper.truncateAll()
    }, true);
  });
  describe('when POST /comments', () => {
    it('should response 200 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment content',
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
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);
      expect(accessToken).toBeDefined();
      expect(typeof accessToken).toBe('string');
      // add thread
      await ThreadsTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: idUser,
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: idUser,
      });
      const threadId = 'thread-123';
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
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
      expect(responseJson.data.addedComment)
        .toBeDefined();
      expect(responseJson.data.addedComment.id)
        .toBeDefined();
      expect(responseJson.data.addedComment.content)
        .toBeDefined();
      expect(responseJson.data.addedComment.owner)
        .toBeDefined();
    });
  });
  describe('when PUT /comments', () => {
    it('should response 200 and persisted comment', async () => {
      // Arrange
      const requestPayloadStore = {
        content: 'comment content',
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
        title: 'thread title',
        body: 'thread body',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: idUser,
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: idUser,
      });
      const threadId = 'thread-123';
      // add comment
      const responseStore = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
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
      expect(responseJsonStore.data.addedComment)
        .toBeDefined();
      expect(responseJsonStore.data.addedComment.id)
        .toBeDefined();
      const idComment = responseJsonStore.data.addedComment.id;
      // Arrange
      const requestPayloadEdited = {
        content: 'comment content',
      };
      // update comment
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${idComment}`,
        payload: requestPayloadEdited,
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
      expect(responseJson.data.editedComment)
        .toBeDefined();
      expect(responseJson.data.editedComment.id)
        .toBeDefined();
      expect(responseJson.data.editedComment.content)
        .toBeDefined();
      expect(responseJson.data.editedComment.owner)
        .toBeDefined();
      expect(responseJson.data.editedComment.content)
        .toEqual(requestPayloadEdited.content);
    });
  });
  describe('when PUT /comments/likes', () => {
    it('should response 200 and persisted comment', async () => {
      // Arrange
      const requestPayloadStore = {
        content: 'comment content',
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
        title: 'thread title',
        body: 'thread body',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: idUser,
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: idUser,
      });
      const threadId = 'thread-123';
      // add comment
      const responseStore = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
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
      expect(responseJsonStore.data.addedComment)
        .toBeDefined();
      expect(responseJsonStore.data.addedComment.id)
        .toBeDefined();
      const idComment = responseJsonStore.data.addedComment.id;
      // Arrange

      // update comment
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${idComment}/likes`,
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
      expect(responseJson.message)
        .not.toEqual('');
    });
  });
  describe('when DELETE /comments', () => {
    it('should response 200 and successfully delete comment', async () => {
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
        title: 'thread title',
        body: 'thread body',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: idUser,
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: idUser,
      });
      const threadId = 'thread-123';
      await CommentsTableTestHelper.addComments({
        id: 'comment-123',
        idThread: 'thread-123',
        content: 'thread comment',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: idUser,
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: idUser,
      });
      const idComment = 'comment-123';
      // delete thread
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${idComment}`,
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
