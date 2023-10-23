/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */

const PostgreSqlTestHelper = require('../../../../../../tests/PostgreSqlTestHelper');
const UsersTableTestHelper = require('../../../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../../../tests/CommentsTableTestHelper');
const CommentUserLikesTableTestHelper = require('../../../../../../tests/CommentUserLikesTableTestHelper');
const RepliesTableTestHelper = require('../../../../../../tests/RepliesTableTestHelper');
const { pool } = require('../../../../database/postgres/pool');
const CommentUserLikeRepositoryPostgres = require('../CommentUserLikeRepositoryPostgres');
const InvariantError = require('../../../../../Commons/exceptions/InvariantError');

describe('CommentUserLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await PostgreSqlTestHelper.runTransaction(async () => {
      await UsersTableTestHelper.deleteAll();
      await AuthenticationsTableTestHelper.deleteAll();
      await ThreadsTableTestHelper.deleteAll();
      await CommentsTableTestHelper.deleteAll();
      await RepliesTableTestHelper.deleteAll();
      await CommentUserLikesTableTestHelper.deleteAll();
    });
  });
  afterAll(async () => {
    await pool.end();
  });
  describe('addCommentLike function', () => {
    it('should persist register comment', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'admin',
        password: 'secret',
        fullname: 'Admin',
      });
      await ThreadsTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'admin',
        body: 'secret',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      });
      await CommentsTableTestHelper.addComments({
        id: 'comment-123',
        idThread: 'thread-123',
        content: 'thread comment',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentUserLikeRepositoryPostgres = new CommentUserLikeRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      // Assert
      const addCommentLike = {
        now: '2023-09-26T18:59:54.813Z',
        liker: 'user-123',
      };
      const addedCommentLike = await commentUserLikeRepositoryPostgres.addCommentLike('comment-123', addCommentLike);
      expect(addedCommentLike).toBeDefined();
      expect(addedCommentLike.id).toEqual('comment-like-123');
      await expect(
        (await CommentUserLikesTableTestHelper.findCommentLikesById(addedCommentLike.id)).length,
      ).toEqual(1);
    });
  });
  describe('getCommentLikes function', () => {
    it('should not return data when id comment is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const commentUserLikeRepositoryPostgres = new CommentUserLikeRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      const commentLike = await commentUserLikeRepositoryPostgres.getCommentLikes('comment-123');
      expect(typeof commentLike).toBe('object');
      expect(Object.keys(commentLike).length).toEqual(0);
    });
    it('should return data when id comment is available', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'admin',
        password: 'secret',
        fullname: 'Admin',
      });
      await ThreadsTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'admin',
        body: 'secret',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      });
      await CommentsTableTestHelper.addComments({
        id: 'comment-123',
        idThread: 'thread-123',
        content: 'thread comment',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      });
      const addCommentLike = {
        id: 'comment-like-123',
        idComment: 'comment-123',
        idUser: 'user-123',
        range: 5,
        createdAt: '2023-09-26T18:59:54.813Z',
        updatedAt: '2023-09-26T18:59:54.813Z',
      };
      await CommentUserLikesTableTestHelper.addCommentLikes(addCommentLike);
      const fakeIdGenerator = () => '123'; // stub!
      const commentUserLikeRepositoryPostgres = new CommentUserLikeRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      // Assert
      const commentLike = await commentUserLikeRepositoryPostgres.getCommentLikes('comment-123');
      expect(typeof commentLike).toBe('object');
      expect(Object.keys(commentLike).length).toEqual(1);
      expect(Object.keys(commentLike[0]).length).toEqual(4);
      expect(commentLike[0].id).toEqual(addCommentLike.id);
      expect(commentLike[0].range).toEqual(addCommentLike.range);
      expect(commentLike[0].date).toEqual(addCommentLike.createdAt);
      expect(commentLike[0].userId).toEqual(addCommentLike.idUser);
    });
  });
  describe('getCommentLikeByIdCommentAndUser function', () => {
    it('should not return data when id comment is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const commentUserLikeRepositoryPostgres = new CommentUserLikeRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      const commentLike = await commentUserLikeRepositoryPostgres.getCommentLikeByIdCommentAndUser('comment-123', 'user-123');
      expect(typeof commentLike).toBe('object');
      expect(Object.keys(commentLike).length).toEqual(0);
    });
    it('should return data when id comment is available', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'admin',
        password: 'secret',
        fullname: 'Admin',
      });
      await ThreadsTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'admin',
        body: 'secret',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      });
      await CommentsTableTestHelper.addComments({
        id: 'comment-123',
        idThread: 'thread-123',
        content: 'thread comment',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      });
      const addCommentLike = {
        id: 'comment-like-123',
        idComment: 'comment-123',
        idUser: 'user-123',
        range: 5,
        createdAt: '2023-09-26T18:59:54.813Z',
        updatedAt: '2023-09-26T18:59:54.813Z',
      };
      await CommentUserLikesTableTestHelper.addCommentLikes(addCommentLike);
      const fakeIdGenerator = () => '123'; // stub!
      const commentUserLikeRepositoryPostgres = new CommentUserLikeRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      // Assert
      const commentLike = await commentUserLikeRepositoryPostgres.getCommentLikeByIdCommentAndUser('comment-123', 'user-123');
      expect(typeof commentLike).toBe('object');
      expect(Object.keys(commentLike).length).toEqual(1);
      expect(Object.keys(commentLike[0]).length).toEqual(3);
      expect(commentLike[0].id).toEqual(addCommentLike.id);
      expect(commentLike[0].range).toEqual(addCommentLike.range);
      expect(commentLike[0].date).toEqual(addCommentLike.createdAt);
    });
  });
  describe('deleteCommentLike function', () => {
    it('should throw InvariantError when id is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const commentUserLikeRepositoryPostgres = new CommentUserLikeRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(commentUserLikeRepositoryPostgres.deleteCommentLike('invalid-comment-123', 'user-123'))
        .rejects.toThrowError(InvariantError);
    });
    it('should not throw InvariantError when id is available', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'admin',
        password: 'secret',
        fullname: 'Admin',
      });
      await ThreadsTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'admin',
        body: 'secret',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      });
      await CommentsTableTestHelper.addComments({
        id: 'comment-123',
        idThread: 'thread-123',
        content: 'secret',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      });
      await CommentUserLikesTableTestHelper.addCommentLikes({
        id: 'comment-like-123',
        idComment: 'comment-123',
        idUser: 'user-123',
        range: 5,
        createdAt: '2023-09-26T18:59:54.813Z',
        updatedAt: '2023-09-26T18:59:54.813Z',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentUserLikeRepositoryPostgres = new CommentUserLikeRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(commentUserLikeRepositoryPostgres.deleteCommentLike('comment-123', 'user-123'))
        .resolves.not.toThrowError(InvariantError);
      await expect((await CommentUserLikesTableTestHelper.findCommentLikesById('comment-like-123')).length)
        .toEqual(0);
    });
  });
});
