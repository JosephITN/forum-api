/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const RegisterThreadId = require('../../../Domains/threads/entities/RegisterThreadId');
const { runTransaction } = require('../../../Infrastructures/utils/helpers');

class ThreadUseCase {
  constructor({
    pool,
    threadRepository,
    commentRepository,
    replyRepository,
    commentUserLikeRepository,
    date,
  }) {
    this.pool = pool;
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
    this.commentUserLikeRepository = commentUserLikeRepository;
    this.date = date;
  }

  async storeThread(useCasePayload, creator) {
    const registerThread = new RegisterThread(useCasePayload);
    return runTransaction(this.pool, async () => {
      const result = await this.threadRepository.addThread({
        ...registerThread,
        now: this.date.toISOString(),
        creator,
      });
      return new RegisteredThread(result);
    });
  }

  /**
   *
   * @param id
   * @returns {Promise<Omit<*, "isDeleted">>}
   */
  async getThread(id) {
    /* eslint-disable no-param-reassign */
    const registerThread = new RegisterThreadId(id);
    const thread = await this.threadRepository.getThreadById(registerThread.id);
    thread.comments = await this.commentRepository.getCommentsByThreadId(registerThread.id);
    if (thread.isDeleted) thread.body = '**thread telah dihapus**';
    if (thread.comments && thread.comments.length > 0) {
      thread.comments = await Promise.all(thread.comments.map(async (comment) => {
        if (comment.isDeleted) comment.content = '**komentar telah dihapus**';
        let replies = await this.replyRepository.getRepliesByCommentId(comment.id);
        const likeCount = (await this.commentUserLikeRepository.getCommentLikes(comment.id)).length;
        if (replies && replies.length > 0) {
          replies = await Promise.all(replies.map(async (reply) => {
            if (reply.isDeleted) reply.content = '**balasan telah dihapus**';
            const { isDeleted, ...redactedReply } = reply;
            return redactedReply;
          }));
        }
        const { isDeleted, ...redactedComment } = comment;
        return { ...redactedComment, likeCount, replies };
      }));
    }
    const { isDeleted, ...redactedThread } = thread;
    /* eslint-enable no-param-reassign */
    return redactedThread;
  }

  /**
   *
   * @param id
   * @param useCasePayload
   * @param editor
   * @returns {Promise<*>}
   */
  async updateThread(id, useCasePayload, editor) {
    const registerThread = new RegisterThread(useCasePayload);
    await this.threadRepository.verifyThreadAvailability(id);
    await this.threadRepository.verifyThreadCreator(id, editor);
    registerThread.now = this.date.toISOString();
    registerThread.editor = editor;
    return runTransaction(this.pool, async () => {
      const result = await this.threadRepository.editThread(id, registerThread);
      return new RegisteredThread(result);
    });
  }

  async deleteThread(id, creator) {
    await this.threadRepository.verifyThreadAvailability(id);
    await this.threadRepository.verifyThreadCreator(id, creator);
    return this.threadRepository.deleteThread(id);
  }

  async deleteSoftThread(id, creator) {
    await this.threadRepository.verifyThreadAvailability(id);
    await this.threadRepository.verifyThreadCreator(id, creator);
    return this.threadRepository
      .deleteSoftThread(id, {
        now: this.date.toISOString(),
        deleter: creator,
      });
  }
}

module.exports = ThreadUseCase;
