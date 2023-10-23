/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const CommentRepository = require('../../../../../Domains/threads/comments/CommentRepository');
const CommentUserLikeRepository = require('../../../../../Domains/threads/comments/CommentUserLikeRepository');
const ThreadRepository = require('../../../../../Domains/threads/ThreadRepository');
const CommentUseCase = require('../CommentUseCase');
const RegisterComment = require('../../../../../Domains/threads/comments/entities/RegisterComment');
const RegisteredComment = require('../../../../../Domains/threads/comments/entities/RegisteredComment');

describe('CommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'thread comment',
    };
    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockDate = {
      toISOString: () => '2023-09-26T18:59:54.813Z',
    };
    const mockReturn = {
      id: 'comment-123',
      ...useCasePayload,
      owner: 'user-123',
    };
    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReturn));
    /** creating use case instance */
    const getCommentUseCase = new CommentUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      date: mockDate,
    });
    // Action
    const registeredComment = await getCommentUseCase.storeComment('thread-123', useCasePayload, 'user-123');
    expect(registeredComment).toStrictEqual((new RegisteredComment(mockReturn)));
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.addComment).toBeCalledWith('thread-123', {
      ...(new RegisterComment(useCasePayload)),
      now: mockDate.toISOString(),
      creator: 'user-123',
    });
  });
  it('should orchestrating the edit comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'thread comment',
    };
    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockDate = {
      toISOString: () => '2023-09-26T18:59:54.813Z',
    };
    const mockReturn = {
      id: 'comment-123', ...useCasePayload, owner: 'user-123',
    };
    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentCreator = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.editComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReturn));
    /** creating use case instance */
    const getCommentUseCase = new CommentUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      date: mockDate,
    });
    // Action
    const registeredComment = await getCommentUseCase.updateComment('thread-123', 'comment-123', useCasePayload, 'user-123');
    expect(registeredComment).toStrictEqual((new RegisteredComment(mockReturn)));
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentByThreadId).toBeCalledWith(mockReturn.id, 'thread-123');
    expect(mockCommentRepository.verifyCommentCreator).toBeCalledWith(mockReturn.id, 'user-123');
    expect(mockCommentRepository.editComment).toBeCalledWith(mockReturn.id, {
      ...(new RegisterComment(useCasePayload)),
      now: mockDate.toISOString(),
      editor: 'user-123',
    });
  });
  it('should orchestrating the unlike comment action correctly', async () => {
    // Arrange

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentUserLikeRepository = new CommentUserLikeRepository();
    const mockDate = {
      toISOString: () => '2023-09-26T18:59:54.813Z',
    };
    const mockReturn = {
      id: 'comment-123', range: 5, date: mockDate.toISOString(),
    };
    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentUserLikeRepository.getCommentLikeByIdCommentAndUser = jest.fn()
      .mockImplementation(() => Promise.resolve([mockReturn]));
    mockCommentUserLikeRepository.deleteCommentLike = jest.fn(() => true);
    /** creating use case instance */
    const getCommentUseCase = new CommentUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      commentUserLikeRepository: mockCommentUserLikeRepository,
      date: mockDate,
    });
    // Action
    const registeredComment = await getCommentUseCase.likeComment('thread-123', 'comment-123', 'user-123');
    expect(registeredComment).toStrictEqual('Comment berhasil batal disukai'/* [mockReturn] */);
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentByThreadId).toBeCalledWith(mockReturn.id, 'thread-123');
    expect(mockCommentUserLikeRepository.getCommentLikeByIdCommentAndUser).toBeCalledWith(mockReturn.id, 'user-123');
    expect(mockCommentUserLikeRepository.deleteCommentLike).toBeCalledWith(mockReturn.id, 'user-123');
  });
  it('should orchestrating the like comment action correctly', async () => {
    // Arrange

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentUserLikeRepository = new CommentUserLikeRepository();
    const mockDate = {
      toISOString: () => '2023-09-26T18:59:54.813Z',
    };
    // const mockReturn = {
    //   id: 'comment-123', range: 5, date: mockDate.toISOString(),
    // };
    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentUserLikeRepository.getCommentLikeByIdCommentAndUser = jest.fn()
      .mockImplementation(() => Promise.resolve([]));
    mockCommentUserLikeRepository.addCommentLike = jest.fn(() => true);
    /** creating use case instance */
    const getCommentUseCase = new CommentUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      commentUserLikeRepository: mockCommentUserLikeRepository,
      date: mockDate,
    });
    // Action
    const registeredComment = await getCommentUseCase.likeComment('thread-123', 'comment-123', 'user-123');
    expect(registeredComment).toStrictEqual('Comment berhasil disukai'/* [mockReturn] */);
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentByThreadId).toBeCalledWith('comment-123', 'thread-123');
    expect(mockCommentUserLikeRepository.getCommentLikeByIdCommentAndUser).toBeCalledWith('comment-123', 'user-123');
    expect(mockCommentUserLikeRepository.addCommentLike).toBeCalledWith('comment-123', {
      now: mockDate.toISOString(),
      liker: 'user-123',
    });
  });
  it('should orchestrating the delete comment action correctly', async () => {
    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockDate = {
      toISOString: () => '2023-09-26T18:59:54.813Z',
    };

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentCreator = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    /** creating use case instance */
    const getCommentUseCase = new CommentUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      date: mockDate,
    });
    // Action
    await getCommentUseCase.deleteComment('thread-123', 'comment-123', 'user-123');
    // assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentByThreadId).toBeCalledWith('comment-123', 'thread-123');
    expect(mockCommentRepository.verifyCommentCreator).toBeCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.deleteComment).toBeCalledWith('comment-123');
  });
  it('should orchestrating the soft delete comment action correctly', async () => {
    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockDate = {
      toISOString: () => '2023-09-26T18:59:54.813Z',
    };

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentCreator = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteSoftComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    /** creating use case instance */
    const getCommentUseCase = new CommentUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      date: mockDate,
    });
    // Action
    await getCommentUseCase.deleteSoftComment('thread-123', 'comment-123', 'user-123');
    // assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentByThreadId).toBeCalledWith('comment-123', 'thread-123');
    expect(mockCommentRepository.verifyCommentCreator).toBeCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.deleteSoftComment).toBeCalledWith('comment-123', {
      now: mockDate.toISOString(),
      deleter: 'user-123',
    });
  });
});
