const RegisterComment = require('../../../../Domains/threads/comments/entities/RegisterComment');
const RegisteredComment = require('../../../../Domains/threads/comments/entities/RegisteredComment');
const { runTransaction } = require('../../../../Infrastructures/utils/helpers');

/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
class CommentUseCase {
  constructor({
    pool, commentRepository, threadRepository, commentUserLikeRepository, date,
  }) {
    this.pool = pool;
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
    this.commentUserLikeRepository = commentUserLikeRepository;
    this.date = date;
  }

  async storeComment(idThread, useCasePayload, creator) {
    const registerComment = new RegisterComment(useCasePayload);
    await this.threadRepository.verifyThreadAvailability(idThread);
    return runTransaction(this.pool, async () => {
      const result = await this.commentRepository.addComment(idThread, {
        ...registerComment,
        now: this.date.toISOString(),
        creator,
      });
      return new RegisteredComment(result);
    });
  }

  async updateComment(idThread, id, useCasePayload, editor) {
    const registerComment = new RegisterComment(useCasePayload);
    await this.threadRepository.verifyThreadAvailability(idThread);
    await this.commentRepository.verifyCommentByThreadId(id, idThread);
    await this.commentRepository.verifyCommentCreator(id, editor);
    return runTransaction(this.pool, async () => {
      const result = await this.commentRepository.editComment(id, {
        ...registerComment,
        now: this.date.toISOString(),
        editor,
      });
      return new RegisteredComment(result);
    });
  }

  async likeComment(idThread, id, liker) {
    await this.threadRepository.verifyThreadAvailability(idThread);
    await this.commentRepository.verifyCommentByThreadId(id, idThread);
    const result = await runTransaction(this.pool, async () => {
      const commentLikes = await this.commentUserLikeRepository
        .getCommentLikeByIdCommentAndUser(id, liker);
      if (commentLikes.length) {
        await this.commentUserLikeRepository.deleteCommentLike(id, liker);
      } else {
        await this.commentUserLikeRepository.addCommentLike(id, {
          now: this.date.toISOString(),
          liker,
        });
      }
      return commentLikes;
    });
    return `Comment berhasil ${result.length ? 'batal ' : ''}disukai`;
  }

  async deleteComment(idThread, id, creator) {
    await this.threadRepository.verifyThreadAvailability(idThread);
    await this.commentRepository.verifyCommentByThreadId(id, idThread);
    await this.commentRepository.verifyCommentCreator(id, creator);
    return this.commentRepository.deleteComment(id);
  }

  async deleteSoftComment(idThread, id, creator) {
    await this.threadRepository.verifyThreadAvailability(idThread);
    await this.commentRepository.verifyCommentByThreadId(id, idThread);
    await this.commentRepository.verifyCommentCreator(id, creator);
    return this.commentRepository.deleteSoftComment(id, {
      now: this.date.toISOString(),
      deleter: creator,
    });
  }
}

module.exports = CommentUseCase;
