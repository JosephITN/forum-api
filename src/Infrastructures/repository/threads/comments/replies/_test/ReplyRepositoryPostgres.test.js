/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const RepliesTableTestHelper = require('../../../../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../../../../tests/UsersTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const { pool } = require('../../../../../database/postgres/pool');
const PostgreSqlTestHelper = require('../../../../../../../tests/PostgreSqlTestHelper');
const NotFoundError = require('../../../../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../../../../Commons/exceptions/InvariantError');
const AuthorizationError = require('../../../../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    // await RepliesTableTestHelper.truncate();
    // await CommentsTableTestHelper.truncate();
    // await ThreadsTableTestHelper.truncate();
    // await UsersTableTestHelper.truncate();
    // await PostgreSqlTestHelper.truncateAll();
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
  describe('verifyReplyCreator function', () => {
    beforeEach(async () => {
      await PostgreSqlTestHelper.runTransaction(async () => {
        await UsersTableTestHelper.deleteAll();
        await AuthenticationsTableTestHelper.deleteAll();
        await ThreadsTableTestHelper.deleteAll();
        await CommentsTableTestHelper.deleteAll();
        await RepliesTableTestHelper.deleteAll();
      }, true);
    });
    it('should throw NotFoundError when id is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.verifyReplyCreator('invalid-reply-123', 'user-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should throw AuthorizationError when creator is not available', async () => {
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
        await CommentsTableTestHelper.addComments({
          id: 'comment-123',
          idThread: 'thread-123',
          content: 'thread comment',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
        await RepliesTableTestHelper.addReplies({
          id: 'reply-123',
          idThread: 'thread-123',
          idComment: 'comment-123',
          idReply: null,
          content: 'comment reply',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
      }, true);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.verifyReplyCreator('reply-123', 'user-123'))
        .resolves.not.toThrowError(NotFoundError);
      await expect(replyRepositoryPostgres.verifyReplyCreator('reply-123', 'invalid-user-123'))
        .rejects.toThrowError(AuthorizationError);
    });
    it('should not throw NotFoundError nor AuthorizationError when id and creator are available', async () => {
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
        await CommentsTableTestHelper.addComments({
          id: 'comment-123',
          idThread: 'thread-123',
          content: 'thread comment',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
        await RepliesTableTestHelper.addReplies({
          id: 'reply-123',
          idThread: 'thread-123',
          idComment: 'comment-123',
          idReply: null,
          content: 'comment reply',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
      }, true);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.verifyReplyCreator('reply-123', 'user-123'))
        .resolves.not.toThrowError(NotFoundError);
      await expect(replyRepositoryPostgres.verifyReplyCreator('reply-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });
  describe('verifyReplyByThreadId function', () => {
    beforeEach(async () => {
      await PostgreSqlTestHelper.runTransaction(async () => {
        await UsersTableTestHelper.deleteAll();
        await AuthenticationsTableTestHelper.deleteAll();
        await ThreadsTableTestHelper.deleteAll();
        await CommentsTableTestHelper.deleteAll();
        await RepliesTableTestHelper.deleteAll();
      }, true);
    });
    it('should throw NotFoundError when id is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.verifyReplyByThreadId('invalid-reply-123', 'thread-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should throw NotFoundError when id thread is not available', async () => {
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
        await CommentsTableTestHelper.addComments({
          id: 'comment-123',
          idThread: 'thread-123',
          content: 'thread comment',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
        await RepliesTableTestHelper.addReplies({
          id: 'reply-123',
          idThread: 'thread-123',
          idComment: 'comment-123',
          idReply: null,
          content: 'comment reply',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
      }, true);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.verifyReplyByThreadId('reply-123', 'invalid-thread-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when id and id thread are available', async () => {
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
      await CommentsTableTestHelper.addComments({
        id: 'comment-123',
        idThread: 'thread-123',
        content: 'thread comment',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      });
      await RepliesTableTestHelper.addReplies({
        id: 'reply-123',
        idThread: 'thread-123',
        idComment: 'comment-123',
        idReply: null,
        content: 'comment reply',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.verifyReplyByThreadId('reply-123', 'thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
  describe('verifyReplyByCommentId function', () => {
    beforeEach(async () => {
      await PostgreSqlTestHelper.runTransaction(async () => {
        await UsersTableTestHelper.deleteAll();
        await AuthenticationsTableTestHelper.deleteAll();
        await ThreadsTableTestHelper.deleteAll();
        await CommentsTableTestHelper.deleteAll();
        await RepliesTableTestHelper.deleteAll();
      }, true);
    });
    it('should throw NotFoundError when id is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.verifyReplyByCommentId('invalid-reply-123', 'comment-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should throw NotFoundError when id comment is not available', async () => {
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
        await CommentsTableTestHelper.addComments({
          id: 'comment-123',
          idThread: 'thread-123',
          content: 'thread comment',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
        await RepliesTableTestHelper.addReplies({
          id: 'reply-123',
          idThread: 'thread-123',
          idComment: 'comment-123',
          idReply: null,
          content: 'comment reply',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
      }, true);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.verifyReplyByCommentId('reply-123', 'invalid-comment-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when id and id comment are available', async () => {
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
        await CommentsTableTestHelper.addComments({
          id: 'comment-123',
          idThread: 'thread-123',
          content: 'thread comment',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
        await RepliesTableTestHelper.addReplies({
          id: 'reply-123',
          idThread: 'thread-123',
          idComment: 'comment-123',
          idReply: null,
          content: 'comment reply',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
      }, true);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.verifyReplyByCommentId('reply-123', 'comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
  describe('verifyReplyAvailability function', () => {
    it('should throw NotFoundError when id is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when id is available', async () => {
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
        await CommentsTableTestHelper.addComments({
          id: 'comment-123',
          idThread: 'thread-123',
          content: 'thread comment',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
        await RepliesTableTestHelper.addReplies({
          id: 'reply-123',
          idThread: 'thread-123',
          idComment: 'comment-123',
          idReply: null,
          content: 'comment reply',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
      }, true);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
  describe('addReply function', () => {
    it('should persist register reply', async () => {
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
        await CommentsTableTestHelper.addComments({
          id: 'comment-123',
          idThread: 'thread-123',
          content: 'thread comment',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
      }, true);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      const addReply = {
        idThread: 'thread-123',
        content: 'test',
        now: '2023-09-26T18:59:54.813Z',
        creator: 'user-123',
      };
      const addedReply = await replyRepositoryPostgres.addReply('comment-123', addReply);
      // await expect(addedReply).resolves.not.toThrowError();
      expect(addedReply.id).toBeDefined();
      expect(typeof addedReply.id).toBe('string');
      expect(addedReply.id).not.toEqual('');
      expect(addedReply.id).toEqual('reply-123');
      expect(addedReply.content).toEqual(addReply.content);
      const addedReplyActual = await RepliesTableTestHelper.findRepliesById(addedReply.id);
      expect(addedReplyActual.length).toEqual(1);
    });
  });
  describe('editReply function', () => {
    it('should throw NotFoundError when id is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.editReply('invalid-reply-123', {
        content: 'comment reply edited',
        now: '2023-09-26T18:59:54.813Z', // new Date().toISOString(),
        editor: 'user-123',
      })).rejects.toThrowError(NotFoundError);
    });
    it('should persist registered reply', async () => {
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
        await CommentsTableTestHelper.addComments({
          id: 'comment-123',
          idThread: 'thread-123',
          content: 'thread comment',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
        await RepliesTableTestHelper.addReplies({
          id: 'reply-123',
          idThread: 'thread-123',
          idComment: 'comment-123',
          idReply: null,
          content: 'comment reply',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
      }, true);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.editReply('reply-123', {
        content: 'comment reply edited',
        now: '2023-09-26T18:59:54.813Z', // new Date().toISOString(),
        editor: 'user-123',
      })).resolves.not.toThrowError(NotFoundError);
    });
  });
  describe('getReplies function', () => {
    it('should not return data when creator is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      const reply = await replyRepositoryPostgres.getReplies('user-123');
      expect(typeof reply).toBe('object');
      expect(Object.keys(reply).length).toEqual(0);
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
        title: 'thread title',
        body: 'thread body',
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
      const newReply = {
        id: 'reply-123',
        idThread: 'thread-123',
        idComment: 'comment-123',
        idReply: null,
        content: 'comment reply',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      };
      await RepliesTableTestHelper.addReplies(newReply);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      const reply = await replyRepositoryPostgres.getReplies('user-123');
      expect(typeof reply).toBe('object');
      expect(Object.keys(reply).length).toEqual(1);
      expect(reply[0].id).toEqual(newReply.id);
      expect(reply[0].content).toEqual(newReply.content);
      expect(reply[0].date).toEqual(newReply.createdAt);
      expect(reply[0].username).toEqual('admin');
    });
  });
  describe('getRepliesByCommentId function', () => {
    it('should return the data when id comment is available', async () => {
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
      await CommentsTableTestHelper.addComments({
        id: 'comment-123',
        idThread: 'thread-123',
        content: 'thread comment',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      });
      const addReply = {
        id: 'reply-123',
        idThread: 'thread-123',
        idComment: 'comment-123',
        idReply: null,
        content: 'comment reply',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      };
      await RepliesTableTestHelper.addReplies(addReply);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      const reply = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');
      expect(typeof reply).toBe('object');
      expect(Object.keys(reply).length).toEqual(1);
      expect(Object.keys(reply[0]).length).toEqual(5);
      expect(reply[0].id).toEqual(addReply.id);
      expect(reply[0].content).toEqual(addReply.content);
      expect(reply[0].date).toEqual(addReply.createdAt);
      expect(reply[0].username).toEqual('admin');
      expect(reply[0].isDeleted).toEqual(false);
    });
  });
  describe('getRepliesByThreadId function', () => {
    it('should return and persist the data when id thread is available', async () => {
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
      await CommentsTableTestHelper.addComments({
        id: 'comment-123',
        idThread: 'thread-123',
        content: 'thread comment',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      });
      const addReply = {
        id: 'reply-123',
        idThread: 'thread-123',
        idComment: 'comment-123',
        idReply: null,
        content: 'comment reply',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      };
      await RepliesTableTestHelper.addReplies(addReply);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      const reply = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');
      expect(typeof reply).toBe('object');
      expect(Object.keys(reply).length).toEqual(1);
      expect(reply[0].id).toEqual(addReply.id);
      expect(reply[0].content).toEqual(addReply.content);
      expect(reply[0].date).toEqual(addReply.createdAt);
      expect(reply[0].username).toEqual('admin');
    });
  });
  describe('getReplyById function', () => {
    it('should throw InvariantError when id is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.getReplyById('invalid-reply-123'))
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
        title: 'thread title',
        body: 'thread body',
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
      const addReply = {
        id: 'reply-123',
        idThread: 'thread-123',
        idComment: 'comment-123',
        idReply: null,
        content: 'comment reply',
        createdAt: '2023-09-26T18:59:54.813Z',
        createdBy: 'user-123',
        updatedAt: '2023-09-26T18:59:54.813Z',
        updatedBy: 'user-123',
      };
      await RepliesTableTestHelper.addReplies(addReply);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      // Assert
      const reply = await replyRepositoryPostgres.getReplyById('reply-123');
      expect(typeof reply).toBe('object');
      expect(Object.keys(reply).length).toEqual(4);
      expect(reply.id).toEqual(addReply.id);
      expect(reply.content).toEqual(addReply.content);
      expect(reply.date).toEqual(addReply.createdAt);
      expect(reply.username).toEqual('admin');
    });
  });
  describe('deleteReply function', () => {
    it('should throw NotFoundError when id is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.deleteReply('invalid-reply-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when id is available', async () => {
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
        await CommentsTableTestHelper.addComments({
          id: 'comment-123',
          idThread: 'thread-123',
          content: 'thread comment',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
        await RepliesTableTestHelper.addReplies({
          id: 'reply-123',
          idThread: 'thread-123',
          idComment: 'comment-123',
          idReply: null,
          content: 'comment reply',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
      }, true);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.deleteReply('reply-123'))
        .resolves.not.toThrowError(NotFoundError);
      await expect((await RepliesTableTestHelper.findRepliesById('reply-123')).length)
        .toEqual(0);
    });
  });
  describe('deleteSoftReply function', () => {
    it('should throw NotFoundError when id not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.deleteSoftReply('invalid-reply-123', {
        now: '2023-09-26T18:59:54.813Z',
        deleter: 'user-123',
      })).rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when id available', async () => {
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
        await CommentsTableTestHelper.addComments({
          id: 'comment-123',
          idThread: 'thread-123',
          content: 'thread comment',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
        await RepliesTableTestHelper.addReplies({
          id: 'reply-123',
          idThread: 'thread-123',
          idComment: 'comment-123',
          idReply: null,
          content: 'comment reply',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
      }, true);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      const replyBeforeSoftDelete = await RepliesTableTestHelper.findRepliesById('reply-123');
      await expect(replyRepositoryPostgres.deleteSoftReply('reply-123', {
        now: '2023-09-26T18:59:54.813Z',
        deleter: 'user-123',
      })).resolves.not.toThrowError(NotFoundError);
      let reply;
      await expect((reply = await RepliesTableTestHelper.findRepliesById('reply-123')).length).toEqual(1);
      await expect(reply).toBeDefined();
      await expect(typeof reply).toBe('object');
      await expect(Object.keys(reply).length).toEqual(1);
      await expect(reply[0].id).toEqual('reply-123');
      await expect(reply[0].content).toEqual(replyBeforeSoftDelete[0].content);
      await expect(reply[0].createdAt).toEqual(replyBeforeSoftDelete[0].createdAt);
      await expect(reply[0].createdBy).toEqual(replyBeforeSoftDelete[0].createdBy);
    });
  });
  describe('deleteReplyByIdComment function', () => {
    it('should throw NotFoundError when parent id thread is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.deleteReplyByIdComment('invalid-comment-123'))
        .rejects.toThrowError(NotFoundError);
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
          title: 'thread title',
          body: 'thread body',
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
        await RepliesTableTestHelper.addReplies({
          id: 'reply-123',
          idThread: 'thread-123',
          idComment: 'comment-123',
          idReply: null,
          content: 'comment reply',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
      }, true);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.deleteReplyByIdComment('comment-123'))
        .resolves.not.toThrowError(NotFoundError);
      await expect((await RepliesTableTestHelper.getRepliesByIdComment('comment-123')).length)
        .toEqual(0);
    });
  });
  describe('deleteSoftReplyByIdComment function', () => {
    it('should throw NotFoundError when parent id thread is not available', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      await expect(replyRepositoryPostgres.deleteSoftReplyByIdComment('invalid-comment-123', {
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
          title: 'thread title',
          body: 'thread body',
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
        await RepliesTableTestHelper.addReplies({
          id: 'reply-123',
          idThread: 'thread-123',
          idComment: 'comment-123',
          idReply: null,
          content: 'comment reply',
          createdAt: '2023-09-26T18:59:54.813Z',
          createdBy: 'user-123',
          updatedAt: '2023-09-26T18:59:54.813Z',
          updatedBy: 'user-123',
        });
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });
      const replyBeforeSoftDelete = await RepliesTableTestHelper.getRepliesByIdComment('comment-123');
      await expect(replyRepositoryPostgres.deleteSoftReplyByIdComment('comment-123', {
        now: '2023-09-26T18:59:54.813Z',
        deleter: 'user-123',
      })).resolves.not.toThrowError(NotFoundError);
      let reply;
      await expect((reply = await RepliesTableTestHelper.getRepliesByIdComment('comment-123')).length).toEqual(1);
      await expect(reply).toBeDefined();
      await expect(typeof reply).toBe('object');
      await expect(Object.keys(reply).length).toEqual(1);
      await expect(reply[0].id).toEqual('reply-123');
      await expect(reply[0].content).toEqual(replyBeforeSoftDelete[0].content);
      await expect(reply[0].createdAt).toEqual(replyBeforeSoftDelete[0].createdAt);
      await expect(reply[0].createdBy).toEqual(replyBeforeSoftDelete[0].createdBy);
    });
  });
});
