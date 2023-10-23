/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const { successResponse } = require('../../../../../Infrastructures/utils/response');
const CommentUseCase = require('../../../../../Applications/services/threads/comments/CommentUseCase');
const { getInstance } = require('../../../../../Infrastructures/utils/helpers');

class CommentsHandler {
  constructor(container) {
    this.container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.putCommentHandler = this.putCommentHandler.bind(this);
    this.likeCommentHandler = this.likeCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const comment = this.container.resolve(getInstance(CommentUseCase.name));
    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;
    const post = await comment.storeComment(threadId, request.payload, credentialId);
    return successResponse(h, 'Comment berhasil ditambahkan', { addedComment: post }, 201);
  }

  async putCommentHandler(request/* , h */) {
    const comment = this.container.resolve(getInstance(CommentUseCase.name));
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const result = await comment.updateComment(
      threadId,
      commentId,
      request.payload,
      credentialId,
    );
    return {
      status: 'success',
      message: 'Comment berhasil diperbarui',
      data: {
        editedComment: result,
      },
    };
  }

  async likeCommentHandler(request/* , h */) {
    const comment = this.container.resolve(getInstance(CommentUseCase.name));
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const message = await comment.likeComment(threadId, commentId, credentialId);
    return {
      status: 'success',
      message,
    };
  }

  async deleteCommentHandler(request/* , h */) {
    const comment = this.container.resolve(getInstance(CommentUseCase.name));
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    await comment.deleteSoftComment(threadId, commentId, credentialId);
    return {
      status: 'success',
      message: 'Comment berhasil dihapus',
    };
  }
}

module.exports = CommentsHandler;
