/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../../tests/AuthenticationsTableTestHelper');
const RepliesTableTestHelper = require('../../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../../tests/CommentsTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const { pool } = require('../../../database/postgres/pool');
const PostgreSqlTestHelper = require('../../../../../tests/PostgreSqlTestHelper');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../../Commons/exceptions/AuthorizationError');
// const InvariantError = require('../../../../Commons/exceptions/InvariantError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    // await UsersTableTestHelper.truncate();
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

  afterAll(async () => {
    await pool.end();
  });
  describe('verifyThreadCreator function', () => {
    beforeEach(async () => {
      await PostgreSqlTestHelper.runTransaction(async () => {
        await UsersTableTestHelper.deleteAll();
        await AuthenticationsTableTestHelper.deleteAll();
        await ThreadsTableTestHelper.deleteAll();
        await CommentsTableTestHelper.deleteAll();
        await RepliesTableTestHelper.deleteAll();
        // await PostgreSqlTestHelper.truncateAll()
      }, true);
    });
    it('should throw NotFoundError when thread is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(threadRepositoryPostgres.verifyThreadCreator('thread-123', 'user-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should AuthorizationError when creator is not available', async () => {
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
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(threadRepositoryPostgres.verifyThreadCreator('thread-123', 'user-123'))
        .resolves.not.toThrowError(NotFoundError);
      await expect(threadRepositoryPostgres.verifyThreadCreator('thread-123', 'invalid-user-123'))
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
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(threadRepositoryPostgres.verifyThreadCreator('thread-123', 'user-123'))
        .resolves.not.toThrowError(NotFoundError);
      await expect(threadRepositoryPostgres.verifyThreadCreator('thread-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });
  describe('verifyThreadAvailability function', () => {
    it('should throw NotFoundError when thread is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(threadRepositoryPostgres.verifyThreadAvailability('invalid-thread-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should AuthorizationError when creator is not available', async () => {
      await PostgreSqlTestHelper.runTransaction(async () => {
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
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
  describe('addThread function', () => {
    it('should persist register thread', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'admin',
        password: 'secret',
        fullname: 'Admin',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      // Assert
      const addThread = {
        title: 'thread title',
        body: 'thread body',
        now: '2023-09-26T18:59:54.813Z',
        creator: 'user-123',
      };
      const addedThread = await threadRepositoryPostgres.addThread(addThread);
      // await expect(addedThread).resolves.not.toThrowError();
      expect(addedThread).toBeDefined();
      expect(addedThread.id).toEqual('thread-123');
      expect(addedThread.title).toEqual(addThread.title);
      expect(addedThread.body).toEqual(addThread.body);
      await expect(((await ThreadsTableTestHelper.findThreadsById(addedThread.id)).length))
        .toEqual(1);
    });
  });
  describe('editThread function', () => {
    it('should throw NotFoundError if id is not exists', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      // Assert
      await expect(threadRepositoryPostgres.editThread('thread-123', {
        title: 'thread title',
        body: 'thread body edited',
        now: '2023-09-26T18:59:54.813Z',
        editor: 'user-123',
      })).rejects.toThrowError(NotFoundError);
    });
    it('should persist registered thread', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'admin',
        password: 'secret',
        fullname: 'Admin',
      });
      await ThreadsTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'admin',
        body: 'thread body',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      // Assert
      await expect(threadRepositoryPostgres.editThread('thread-123', {
        title: 'thread title',
        body: 'thread body edited',
        now: '2023-09-26T18:59:54.813Z',
        editor: 'user-123',
      })).resolves.not.toThrowError(NotFoundError);
    });
  });
  describe('getThreads function', () => {
    it('should not return data when creator not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      const thread = await threadRepositoryPostgres.getThreads('user-123');
      expect(typeof thread).toBe('object');
      expect(Object.keys(thread).length).toEqual(0);
    });
    it('should return data when creator available', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'admin',
        password: 'secret',
        fullname: 'Admin',
      });
      const addThread = {
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      };
      await ThreadsTableTestHelper.addThreads(addThread);
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      const thread = await threadRepositoryPostgres.getThreads('user-123');
      expect(typeof thread).toBe('object');
      expect(Object.keys(thread).length).toEqual(1);
      expect(Object.keys(thread[0]).length).toEqual(5);
      expect(thread[0].id).toEqual(addThread.id);
      expect(thread[0].title).toEqual(addThread.title);
      expect(thread[0].body).toEqual(addThread.body);
      expect(thread[0].date).toEqual(addThread.createdAt);
      expect(thread[0].is_deleted).toEqual(false);
    });
  });
  describe('getThreadById function', () => {
    it('should throw NotFoundError when id thread is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when id thread is available', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'admin',
        password: 'secret',
        fullname: 'Admin',
      });
      const addThread = {
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      };
      await ThreadsTableTestHelper.addThreads(addThread);
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');
      expect(typeof thread).toBe('object');
      expect(Object.keys(thread).length).toEqual(6);
      expect(thread.id).toEqual(addThread.id);
      expect(thread.title).toEqual(addThread.title);
      expect(thread.body).toEqual(addThread.body);
      expect(thread.date).toEqual(addThread.createdAt);
      expect(thread.username).toEqual('admin');
      expect(thread.is_deleted).toEqual(false);
    });
  });
  describe('deleteThread function', () => {
    it('should throw NotFoundError when id thread is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(threadRepositoryPostgres.deleteThread('thread-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when id thread is available', async () => {
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
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(threadRepositoryPostgres.deleteThread('thread-123'))
        .resolves.not.toThrowError(NotFoundError);
      await expect((await ThreadsTableTestHelper.findThreadsById('thread-123')).length)
        .toEqual(0);
    });
  });
  describe('deleteSoftThread function', () => {
    it('should throw NotFoundError when id thread is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(threadRepositoryPostgres.deleteSoftThread('thread-123', {
        now: '2023-09-26T18:59:54.813Z',
        deleter: 'user-123',
      })).rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when id thread is available', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'admin',
        password: 'secret',
        fullname: 'Admin',
      });
      const addThread = {
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      };
      await ThreadsTableTestHelper.addThreads(addThread);
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(threadRepositoryPostgres.deleteSoftThread('thread-123', {
        now: '2023-09-26T18:59:54.813Z',
        deleter: 'user-123',
      })).resolves.not.toThrowError(NotFoundError);
      let thread;
      await expect((thread = await ThreadsTableTestHelper.findThreadsById('thread-123')).length).toEqual(1);
      await expect(thread).toBeDefined();
      await expect(typeof thread).toBe('object');
      await expect(Object.keys(thread).length).toEqual(1);
      await expect(thread[0].id).toEqual(addThread.id);
      await expect(thread[0].title).toEqual(addThread.title);
      await expect(thread[0].body).toEqual(addThread.body);
    });
  });
});
