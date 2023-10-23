/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const RepliesTableTestHelper = require('../../../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../../../tests/AuthenticationsTableTestHelper');
const PostgreSqlTestHelper = require('../../../../../../tests/PostgreSqlTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const { pool } = require('../../../../database/postgres/pool');
// const InvariantError = require('../../../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    // PostgreSqlTestHelper.beginTransaction()
    //     .then(async () => PostgreSqlTestHelper.setTransactionSerializable())
    //     .then(async () => {
    //         await RepliesTableTestHelper.truncate();
    //         await CommentsTableTestHelper.truncate();
    //         await ThreadsTableTestHelper.truncate();
    //         await UsersTableTestHelper.truncate();
    //     }).then(async () => PostgreSqlTestHelper.commitTransaction())
    // await PostgreSqlTestHelper.beginTransaction();
    // await PostgreSqlTestHelper.setTransactionSerializable();
    // await RepliesTableTestHelper.truncate();
    // await CommentsTableTestHelper.truncate();
    // await ThreadsTableTestHelper.truncate();
    // await UsersTableTestHelper.truncate();
    // await PostgreSqlTestHelper.commitTransaction();
    // await PostgreSqlTestHelper.truncateAll();
    await PostgreSqlTestHelper.runTransaction(async () => {
      await UsersTableTestHelper.deleteAll();
      await AuthenticationsTableTestHelper.deleteAll();
      await ThreadsTableTestHelper.deleteAll();
      await CommentsTableTestHelper.deleteAll();
      await RepliesTableTestHelper.deleteAll();
      // await PostgreSqlTestHelper.truncateAll()
    });
  });

  afterAll(async () => {
    await pool.end();
  });
  describe('verifyCommentCreator function', () => {
    beforeEach(async () => {
      await PostgreSqlTestHelper.runTransaction(async () => {
        await UsersTableTestHelper.deleteAll();
        await AuthenticationsTableTestHelper.deleteAll();
        await ThreadsTableTestHelper.deleteAll();
        await CommentsTableTestHelper.deleteAll();
        await RepliesTableTestHelper.deleteAll();
      });
    });
    it('should throw NotFoundError id is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(commentRepositoryPostgres.verifyCommentCreator('comment-123', 'user-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should throw AuthorizationError when creator is not available', async () => {
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
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(commentRepositoryPostgres.verifyCommentCreator('comment-123', 'user-123'))
        .resolves.not.toThrowError(NotFoundError);
      await expect(commentRepositoryPostgres.verifyCommentCreator('comment-123', 'invalid-user-123'))
        .rejects.toThrowError(AuthorizationError);
    });
    it('should not throw NotFoundError nor AuthorizationError', async () => {
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
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(commentRepositoryPostgres.verifyCommentCreator('comment-123', 'user-123'))
        .resolves.not.toThrowError(NotFoundError);
      await expect(commentRepositoryPostgres.verifyCommentCreator('comment-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });
  describe('verifyCommentByThreadId function', () => {
    beforeEach(async () => {
      await PostgreSqlTestHelper.runTransaction(async () => {
        await UsersTableTestHelper.deleteAll();
        await AuthenticationsTableTestHelper.deleteAll();
        await ThreadsTableTestHelper.deleteAll();
        await CommentsTableTestHelper.deleteAll();
        await RepliesTableTestHelper.deleteAll();
      });
    });
    it('should throw NotFoundError id is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(commentRepositoryPostgres.verifyCommentByThreadId('comment-123', 'thread-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should throw NotFoundError when id thread is not available', async () => {
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
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(commentRepositoryPostgres.verifyCommentByThreadId('comment-123', 'thread-123'))
        .resolves.not.toThrowError(NotFoundError);
      await expect(commentRepositoryPostgres.verifyCommentByThreadId('comment-123', 'invalid-thread-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError', async () => {
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
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(commentRepositoryPostgres.verifyCommentByThreadId('comment-123', 'thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
  describe('verifyCommentAvailability function', () => {
    it('should throw NotFoundError when id is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError', async () => {
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
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
  describe('addComment function', () => {
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
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      // Assert
      const addComment = {
        content: 'secret comment',
        now: '2023-09-26T18:59:54.813Z',
        creator: 'user-123',
      };
      const addedComment = await commentRepositoryPostgres.addComment('thread-123', addComment);
      // await expect(addedComment).resolves.not.toThrowError();
      expect(addedComment).toBeDefined();
      expect(addedComment.id).toEqual('comment-123');
      expect(addedComment.content).toEqual(addComment.content);
      await expect((await CommentsTableTestHelper.findCommentsById(addedComment.id)).length)
        .toEqual(1);
    });
  });
  describe('editComment function', () => {
    it('should throw NotFoundError when id is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      // Assert
      await expect(commentRepositoryPostgres.editComment('comment-123', {
        content: 'secret reply edited',
        now: '2023-09-26T18:59:54.813Z', // new Date().toISOString(),
        editor: 'user-123',
      })).rejects.toThrowError(NotFoundError);
    });
    it('should persist registered comment', async () => {
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
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      // Assert
      await expect(commentRepositoryPostgres.editComment('comment-123', {
        content: 'secret reply edited',
        now: '2023-09-26T18:59:54.813Z', // new Date().toISOString(),
        editor: 'user-123',
      })).resolves.not.toThrowError(NotFoundError);
    });
  });
  describe('getComments function', () => {
    it('should not return data when creator is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      const comment = await commentRepositoryPostgres.getComments('user-123');
      expect(typeof comment).toBe('object');
      expect(Object.keys(comment).length).toEqual(0);
    });
    it('should return data when creator is available', async () => {
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
      const addComment = {
        id: 'comment-123',
        idThread: 'thread-123',
        content: 'thread comment',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      };
      await CommentsTableTestHelper.addComments(addComment);
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      // Assert
      const comment = await commentRepositoryPostgres.getComments('user-123');
      expect(typeof comment).toBe('object');
      expect(Object.keys(comment).length).toEqual(1);
      expect(Object.keys(comment[0]).length).toEqual(3);
      expect(comment[0].id).toEqual(addComment.id);
      expect(comment[0].content).toEqual(addComment.content);
      expect(comment[0].date).toEqual(addComment.createdAt);
    });
  });
  describe('getCommentsByThreadId function', () => {
    it('should not throw InvariantError when id thread is available', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'admin',
        password: 'secret',
        fullname: 'Admin',
      });
      await ThreadsTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      });
      const addComment = {
        id: 'comment-123',
        idThread: 'thread-123',
        content: 'thread comment',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      };
      await CommentsTableTestHelper.addComments(addComment);
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      // Assert
      const comment = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
      expect(typeof comment).toBe('object');
      expect(Object.keys(comment).length).toEqual(1);
      expect(comment[0].id).toEqual(addComment.id);
      expect(comment[0].content).toEqual(addComment.content);
      expect(comment[0].date).toEqual(addComment.createdAt);
      expect(comment[0].username).toEqual('admin');
    });
  });
  describe('getCommentById function', () => {
    it('should throw NotFoundError when id is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      // Assert
      await expect(commentRepositoryPostgres.getCommentById('invalid-comment-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should persist comment content when id is available', async () => {
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
      const addComment = {
        id: 'comment-123',
        idThread: 'thread-123',
        content: 'secret',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      };
      await CommentsTableTestHelper.addComments(addComment);
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      // Assert
      const comment = await commentRepositoryPostgres.getCommentById('comment-123');
      expect(typeof comment).toBe('object');
      expect(Object.keys(comment).length).toEqual(4);
      expect(comment.id).toEqual(addComment.id);
      expect(comment.content).toEqual(addComment.content);
      expect(comment.date).toEqual(addComment.createdAt);
      expect(comment.username).toEqual('admin');
    });
  });
  describe('deleteComment function', () => {
    it('should throw NotFoundError when id is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(commentRepositoryPostgres.deleteComment('invalid-comment-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when id is available', async () => {
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
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(commentRepositoryPostgres.deleteComment('comment-123'))
        .resolves.not.toThrowError(NotFoundError);
      await expect((await CommentsTableTestHelper.findCommentsById('comment-123')).length)
        .toEqual(0);
    });
  });
  describe('deleteSoftComment function', () => {
    it('should throw NotFoundError when id is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(commentRepositoryPostgres.deleteSoftComment('invalid-comment-123', {
        now: '2023-09-26T18:59:54.813Z',
        deleter: 'user-123',
      })).rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when id is available', async () => {
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
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      const commentBeforeSoftDelete = await CommentsTableTestHelper.findCommentsById('comment-123');
      await expect(commentRepositoryPostgres.deleteSoftComment('comment-123', {
        now: '2023-09-26T18:59:54.813Z',
        deleter: 'user-123',
      })).resolves.not.toThrowError(NotFoundError);
      let comment;
      await expect((comment = await CommentsTableTestHelper.findCommentsById('comment-123')).length).toEqual(1);
      await expect(comment).toBeDefined();
      await expect(typeof comment).toBe('object');
      await expect(Object.keys(comment).length).toEqual(1);
      await expect(comment[0].id).toEqual(commentBeforeSoftDelete[0].id);
      await expect(comment[0].content).toEqual(commentBeforeSoftDelete[0].content);
      await expect(comment[0].createdAt).toEqual(commentBeforeSoftDelete[0].createdAt);
      await expect(comment[0].createdBy).toEqual(commentBeforeSoftDelete[0].createdBy);
    });
  });
  describe('deleteCommentByIdThread function', () => {
    it('should throw NotFoundError when parent id thread is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(commentRepositoryPostgres.deleteCommentByIdThread('invalid-thread-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when parent id thread is available', async () => {
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
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(commentRepositoryPostgres.deleteCommentByIdThread('thread-123'))
        .resolves.not.toThrowError(NotFoundError);
      await expect((await CommentsTableTestHelper.getCommentsByIdThread('thread-123')).length)
        .toEqual(0);
    });
  });
  describe('deleteSoftCommentByIdThread function', () => {
    it('should throw NotFoundError when parent id thread is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(commentRepositoryPostgres.deleteSoftCommentByIdThread('invalid-thread-123', {
        now: '2023-09-26T18:59:54.813Z',
        deleter: 'user-123',
      })).rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when parent id thread is available', async () => {
      await PostgreSqlTestHelper.runTransaction(async () => {
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
      }, true);
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      const commentBeforeSoftDelete = await CommentsTableTestHelper.getCommentsByIdThread('thread-123');
      await expect(commentRepositoryPostgres.deleteSoftCommentByIdThread('thread-123', {
        now: '2023-09-26T18:59:54.813Z',
        deleter: 'user-123',
      })).resolves.not.toThrowError(NotFoundError);
      let comment;
      await expect((comment = await CommentsTableTestHelper.getCommentsByIdThread('thread-123')).length).toEqual(1);
      await expect(comment).toBeDefined();
      await expect(typeof comment).toBe('object');
      await expect(Object.keys(comment).length).toEqual(1);
      await expect(comment[0].id).toEqual(commentBeforeSoftDelete[0].id);
      await expect(comment[0].content).toEqual(commentBeforeSoftDelete[0].content);
      await expect(comment[0].createdAt).toEqual(commentBeforeSoftDelete[0].createdAt);
      await expect(comment[0].createdBy).toEqual(commentBeforeSoftDelete[0].createdBy);
    });
  });
});
