/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const RegisterThread = require('../../../../Domains/threads/entities/RegisterThread');
const RegisteredThread = require('../../../../Domains/threads/entities/RegisteredThread');
const RegisterThreadId = require('../../../../Domains/threads/entities/RegisterThreadId');
const ThreadUseCase = require('../ThreadUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/threads/comments/CommentRepository');
const CommentUserLikeRepository = require('../../../../Domains/threads/comments/CommentUserLikeRepository');
const ReplyRepository = require('../../../../Domains/threads/comments/replies/ReplyRepository');

describe('ThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'thread title',
      body: 'thread body',
    };
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockDate = {
      toISOString: () => '2023-09-26T18:59:54.813Z',
    };

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        ...useCasePayload,
        owner: 'user-123',
      }));

    /** creating use case instance */
    const getThreadUseCase = new ThreadUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      threadRepository: mockThreadRepository/* , userRepository */,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      date: mockDate,
    });
    // Action
    const registeredThread = await getThreadUseCase.storeThread(useCasePayload, 'user-123');
    // Assert
    expect(registeredThread).toStrictEqual((new RegisteredThread({
      id: 'thread-123',
      ...useCasePayload,
      owner: 'user-123',
    })));
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith({
      ...(new RegisterThread(useCasePayload)),
      now: mockDate.toISOString(),
      creator: 'user-123',
    });
  });
  it('should orchestrating the retrieval thread action correctly', async () => {
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentUserLikeRepository = new CommentUserLikeRepository();
    const mockRegisterThreadId = new RegisterThreadId('thread-123');
    const mockDate = {
      toISOString: () => '2023-09-26T18:59:54.813Z',
    };

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        date: mockDate.toISOString(),
        username: 'user-123',
        isDeleted: false,
        comments: [],
      }));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'comment-123',
        content: 'thread comment',
        date: mockDate.toISOString(),
        username: 'user-123',
        isDeleted: false,
        replies: [],
      }]));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'reply-123',
        content: 'comment reply',
        date: mockDate.toISOString(),
        username: 'user-123',
        isDeleted: false,
      }]));
    mockCommentUserLikeRepository.getCommentLikes = jest.fn(() => ({
      length: 0,
    }));

    /** creating use case instance */
    const getThreadUseCase = new ThreadUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      threadRepository: mockThreadRepository/* , userRepository */,
      commentRepository: mockCommentRepository,
      commentUserLikeRepository: mockCommentUserLikeRepository,
      replyRepository: mockReplyRepository,
      date: mockDate,
    });
    // Action
    const registeredThread = await getThreadUseCase.getThread('thread-123');
    // Assert
    expect(registeredThread).toStrictEqual({
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: mockDate.toISOString(),
      username: 'user-123',
      comments: [{
        id: 'comment-123',
        content: 'thread comment',
        date: mockDate.toISOString(),
        username: 'user-123',
        likeCount: 0,
        replies: [{
          id: 'reply-123',
          content: 'comment reply',
          date: mockDate.toISOString(),
          username: 'user-123',
        }],
      }],
    });
    expect(mockThreadRepository.getThreadById)
      .toBeCalledWith((mockRegisterThreadId).id);
    expect(mockCommentRepository.getCommentsByThreadId)
      .toBeCalledWith((mockRegisterThreadId).id);
  });
  it('should orchestrating the retrieval thread with empty comments action correctly', async () => {
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentUserLikeRepository = new CommentUserLikeRepository();
    const mockRegisterThreadId = new RegisterThreadId('thread-123');
    const mockDate = {
      toISOString: () => '2023-09-26T18:59:54.813Z',
    };

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        date: mockDate.toISOString(),
        username: 'user-123',
        isDeleted: false,
        comments: [],
      }));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    /** creating use case instance */
    const getThreadUseCase = new ThreadUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      threadRepository: mockThreadRepository/* , userRepository */,
      commentRepository: mockCommentRepository,
      commentUserLikeRepository: mockCommentUserLikeRepository,
      replyRepository: mockReplyRepository,
      date: mockDate,
    });
    // Action
    const registeredThread = await getThreadUseCase.getThread('thread-123');
    // Assert
    expect(registeredThread).toStrictEqual({
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: mockDate.toISOString(),
      username: 'user-123',
      comments: [],
    });
    expect(mockThreadRepository.getThreadById)
      .toBeCalledWith((mockRegisterThreadId).id);
    expect(mockCommentRepository.getCommentsByThreadId)
      .toBeCalledWith((mockRegisterThreadId).id);
  });
  it('should orchestrating the retrieval thread with empty replies action correctly', async () => {
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentUserLikeRepository = new CommentUserLikeRepository();
    const mockRegisterThreadId = new RegisterThreadId('thread-123');
    const mockDate = {
      toISOString: () => '2023-09-26T18:59:54.813Z',
    };

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        date: mockDate.toISOString(),
        username: 'user-123',
        isDeleted: false,
        comments: [],
      }));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'comment-123',
        content: 'thread comment',
        date: mockDate.toISOString(),
        username: 'user-123',
        isDeleted: false,
        replies: [],
      }]));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));
    mockCommentUserLikeRepository.getCommentLikes = jest.fn(() => ({
      length: 2,
    }));

    /** creating use case instance */
    const getThreadUseCase = new ThreadUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      threadRepository: mockThreadRepository/* , userRepository */,
      commentRepository: mockCommentRepository,
      commentUserLikeRepository: mockCommentUserLikeRepository,
      replyRepository: mockReplyRepository,
      date: mockDate,
    });
    // Action
    const registeredThread = await getThreadUseCase.getThread('thread-123');
    // Assert
    expect(registeredThread).toStrictEqual({
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: mockDate.toISOString(),
      username: 'user-123',
      comments: [{
        id: 'comment-123',
        content: 'thread comment',
        date: mockDate.toISOString(),
        username: 'user-123',
        likeCount: 2,
        replies: [],
      }],
    });
    expect(mockThreadRepository.getThreadById)
      .toBeCalledWith((mockRegisterThreadId).id);
    expect(mockCommentRepository.getCommentsByThreadId)
      .toBeCalledWith((mockRegisterThreadId).id);
  });
  it('should orchestrating the retrieval thread when content deleted', async () => {
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentUserLikeRepository = new CommentUserLikeRepository();
    const mockRegisterThreadId = new RegisterThreadId('thread-123');
    const mockDate = {
      toISOString: () => '2023-09-26T18:59:54.813Z',
    };

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        date: mockDate.toISOString(),
        username: 'user-123',
        isDeleted: true,
        comments: [],
      }));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'comment-123',
        content: 'thread comment',
        date: mockDate.toISOString(),
        username: 'user-123',
        isDeleted: true,
        replies: [],
      }]));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'reply-123',
        content: 'comment reply',
        date: mockDate.toISOString(),
        username: 'user-123',
        isDeleted: true,
      }]));
    mockCommentUserLikeRepository.getCommentLikes = jest.fn(() => ({
      length: 1,
    }));

    /** creating use case instance */
    const getThreadUseCase = new ThreadUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      threadRepository: mockThreadRepository/* , userRepository */,
      commentRepository: mockCommentRepository,
      commentUserLikeRepository: mockCommentUserLikeRepository,
      replyRepository: mockReplyRepository,
      date: mockDate,
    });
    // Action
    const registeredThread = await getThreadUseCase.getThread('thread-123');
    // Assert
    expect(registeredThread).toStrictEqual({
      id: 'thread-123',
      title: 'thread title',
      body: '**thread telah dihapus**',
      date: mockDate.toISOString(),
      username: 'user-123',
      comments: [{
        id: 'comment-123',
        content: '**komentar telah dihapus**',
        date: mockDate.toISOString(),
        username: 'user-123',
        likeCount: 1,
        replies: [{
          id: 'reply-123',
          content: '**balasan telah dihapus**',
          date: mockDate.toISOString(),
          username: 'user-123',
        }],
      }],
    });
    expect(mockThreadRepository.getThreadById)
      .toBeCalledWith((mockRegisterThreadId).id);
    expect(mockCommentRepository.getCommentsByThreadId)
      .toBeCalledWith((mockRegisterThreadId).id);
  });
  it('should orchestrating the edit thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'thread title',
      body: 'thread body',
    };
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockDate = {
      toISOString: () => '2023-09-26T18:59:54.813Z',
    };
    const mockReturn = {
      id: 'thread-123',
      ...useCasePayload,
      owner: 'user-123',
    };

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadCreator = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.editThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReturn));

    /** creating use case instance */
    const getThreadUseCase = new ThreadUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      threadRepository: mockThreadRepository/* , userRepository */,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      date: mockDate,
    });
    // Action
    const registeredThread = await getThreadUseCase.updateThread('thread-123', useCasePayload, 'user-123');
    // assert
    expect(registeredThread).toStrictEqual((new RegisteredThread({
      ...mockReturn,
      owner: 'user-123',
    })));
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(mockReturn.id);
    expect(mockThreadRepository.verifyThreadCreator).toBeCalledWith(mockReturn.id, 'user-123');
    expect(mockThreadRepository.editThread).toBeCalledWith(mockReturn.id, {
      ...(new RegisterThread(useCasePayload)),
      now: mockDate.toISOString(),
      editor: 'user-123',
    });
  });
  it('should orchestrating the delete thread action correctly', async () => {
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockDate = {
      toISOString: () => '2023-09-26T18:59:54.813Z',
    };
    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadCreator = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.deleteThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getThreadUseCase = new ThreadUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      threadRepository: mockThreadRepository/* , userRepository */,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      date: mockDate,
    });
    // Action
    /* const registeredThread = */ await getThreadUseCase.deleteThread('thread-123', 'user-123');
    // assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockThreadRepository.verifyThreadCreator).toBeCalledWith('thread-123', 'user-123');
    expect(mockThreadRepository.deleteThread).toBeCalledWith('thread-123');
  });
  it('should orchestrating the soft delete thread action correctly', async () => {
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockDate = {
      toISOString: () => '2023-09-26T18:59:54.813Z',
    };
    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadCreator = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.deleteSoftThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getThreadUseCase = new ThreadUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      threadRepository: mockThreadRepository/* , userRepository */,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      date: mockDate,
    });
    // Action
    /* const registeredThread = */ await getThreadUseCase.deleteSoftThread('thread-123', 'user-123');
    // assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockThreadRepository.verifyThreadCreator).toBeCalledWith('thread-123', 'user-123');
    expect(mockThreadRepository.deleteSoftThread).toBeCalledWith('thread-123', {
      now: mockDate.toISOString(),
      deleter: 'user-123',
    });
  });
});
