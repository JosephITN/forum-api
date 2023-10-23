const RegisterReply = require('../../../../../Domains/threads/comments/replies/entities/RegisterReply');
const RegisteredReply = require('../../../../../Domains/threads/comments/replies/entities/RegisteredReply');
const { runTransaction } = require('../../../../../Infrastructures/utils/helpers');

/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
class ReplyUseCase {
  constructor({
    pool,
    replyRepository,
    threadRepository,
    commentRepository,
    date,
  }) {
    this.pool = pool;
    this.replyRepository = replyRepository;
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.date = date;
  }

  async storeReply(idThread, idComment, useCasePayload, creator) {
    const registerReply = new RegisterReply(useCasePayload);
    await this.threadRepository.verifyThreadAvailability(idThread);
    await this.commentRepository.verifyCommentByThreadId(idComment, idThread);
    return runTransaction(this.pool, async () => {
      const result = await this.replyRepository.addReply(idComment, {
        idThread,
        ...registerReply,
        now: this.date.toISOString(),
        creator,
      });
      return new RegisteredReply(result);
    });
  }

  async updateReply(idThread, idComment, id, useCasePayload, editor) {
    const registerReply = new RegisterReply(useCasePayload);
    await this.threadRepository.verifyThreadAvailability(idThread);
    await this.commentRepository.verifyCommentByThreadId(idComment, idThread);
    await this.replyRepository.verifyReplyByCommentId(id, idComment);
    await this.replyRepository.verifyReplyCreator(id, editor);
    return runTransaction(this.pool, async () => {
      const result = await this.replyRepository.editReply(id, {
        ...registerReply,
        now: this.date.toISOString(),
        editor,
      });
      return new RegisteredReply(result);
    });
  }

  async deleteReply(idThread, idComment, id, creator) {
    await this.threadRepository.verifyThreadAvailability(idThread);
    await this.commentRepository.verifyCommentByThreadId(idComment, idThread);
    await this.replyRepository.verifyReplyByCommentId(id, idComment);
    await this.replyRepository.verifyReplyCreator(id, creator);
    return this.replyRepository.deleteReply(id);
  }

  async deleteSoftReply(idThread, idComment, id, creator) {
    await this.threadRepository.verifyThreadAvailability(idThread);
    await this.commentRepository.verifyCommentByThreadId(idComment, idThread);
    await this.replyRepository.verifyReplyByCommentId(id, idComment);
    await this.replyRepository.verifyReplyCreator(id, creator);
    return this.replyRepository.deleteSoftReply(id, {
      now: this.date.toISOString(),
      deleter: creator,
    });
  }
}

module.exports = ReplyUseCase;
