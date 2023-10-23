/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const RegisterReply = require('../../../../../../Domains/threads/comments/replies/entities/RegisterReply');
const RegisteredReply = require('../../../../../../Domains/threads/comments/replies/entities/RegisteredReply');
const ReplyUseCase = require('../ReplyUseCase');
const ReplyRepository = require('../../../../../../Domains/threads/comments/replies/ReplyRepository');
const CommentRepository = require('../../../../../../Domains/threads/comments/CommentRepository');
const ThreadRepository = require('../../../../../../Domains/threads/ThreadRepository');

describe('ReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'comment reply',
    };
    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockDate = {
      toISOString: () => '2023-09-26T18:59:54.813Z',
    };
    const mockReturn = {
      id: 'reply-123',
      ...useCasePayload,
      owner: 'user-123',
    };
    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReturn));
    /** creating use case instance */
    const getReplyUseCase = new ReplyUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      date: mockDate,
    });
    // Action
    const registeredReply = await getReplyUseCase.storeReply('thread-123', 'comment-123', useCasePayload, 'user-123');
    expect(registeredReply).toStrictEqual((new RegisteredReply(mockReturn)));
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentByThreadId).toBeCalledWith('comment-123', 'thread-123');
    expect(mockReplyRepository.addReply).toBeCalledWith('comment-123', {
      idThread: 'thread-123',
      ...(new RegisterReply(useCasePayload)),
      now: mockDate.toISOString(),
      creator: 'user-123',
    });
  });
  it('should orchestrating the edit reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'comment reply',
    };
    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockDate = {
      toISOString: () => '2023-09-26T18:59:54.813Z',
    };
    // Mock the Date object
    // const mockDate = jest.spyOn(Date.prototype, 'toISOString')
    //     .mockReturnValue('2023-09-26T18:59:54.813Z');
    // mockDate.mockImplementation(()=>'2023-09-26T18:59:54.813Z');

    const mockReturn = {
      id: 'reply-123',
      ...useCasePayload,
      owner: 'user-123',
    };
    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyCreator = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.editReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReturn));
    /** creating use case instance */
    const getReplyUseCase = new ReplyUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      date: mockDate,
    });
    // Action
    const registeredReply = await getReplyUseCase.updateReply(
      'thread-123',
      'comment-123',
      'reply-123',
      useCasePayload,
      'user-123',
    );
    expect(registeredReply).toStrictEqual((new RegisteredReply(mockReturn)));
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentByThreadId).toBeCalledWith('comment-123', 'thread-123');
    expect(mockReplyRepository.verifyReplyByCommentId).toBeCalledWith('reply-123', 'comment-123');
    expect(mockReplyRepository.verifyReplyCreator).toBeCalledWith('reply-123', 'user-123');
    expect(mockReplyRepository.editReply).toBeCalledWith('reply-123', {
      ...(new RegisterReply(useCasePayload)),
      now: mockDate.toISOString(), // Date.prototype.toISOString.call(new Date()),
      editor: 'user-123',
    });
  });
  it('should orchestrating the delete reply action correctly', async () => {
    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
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
    mockReplyRepository.verifyReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyCreator = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    /** creating use case instance */
    const getReplyUseCase = new ReplyUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      date: mockDate,
    });
    // Action
    await getReplyUseCase.deleteReply('thread-123', 'comment-123', 'reply-123', 'user-123');
    // assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentByThreadId).toBeCalledWith('comment-123', 'thread-123');
    expect(mockReplyRepository.verifyReplyByCommentId).toBeCalledWith('reply-123', 'comment-123');
    expect(mockReplyRepository.verifyReplyCreator).toBeCalledWith('reply-123', 'user-123');
    expect(mockReplyRepository.deleteReply).toBeCalledWith('reply-123');
  });
  it('should orchestrating the soft delete reply action correctly', async () => {
    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
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
    mockReplyRepository.verifyReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyCreator = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteSoftReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    /** creating use case instance */
    const getReplyUseCase = new ReplyUseCase({
      pool: {
        connect: () => ({
          query: (query) => true,
          release: () => true,
        }),
      },
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      date: mockDate,
    });
    // Action
    await getReplyUseCase.deleteSoftReply('thread-123', 'comment-123', 'reply-123', 'user-123');
    // assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentByThreadId).toBeCalledWith('comment-123', 'thread-123');
    expect(mockReplyRepository.verifyReplyByCommentId).toBeCalledWith('reply-123', 'comment-123');
    expect(mockReplyRepository.verifyReplyCreator).toBeCalledWith('reply-123', 'user-123');
    expect(mockReplyRepository.deleteSoftReply).toBeCalledWith('reply-123', {
      now: mockDate.toISOString(),
      deleter: 'user-123',
    });
  });
});
