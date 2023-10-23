/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const { successResponse } = require('../../../../../../Infrastructures/utils/response');
const ReplyUseCase = require('../../../../../../Applications/services/threads/comments/replies/ReplyUseCase');
const { getInstance } = require('../../../../../../Infrastructures/utils/helpers');

class RepliesHandler {
  constructor(container) {
    this.container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.putReplyHandler = this.putReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const reply = this.container.resolve(getInstance(ReplyUseCase.name));
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const post = await reply.storeReply(threadId, commentId, request.payload, credentialId);
    return successResponse(h, 'Reply berhasil ditambahkan', { addedReply: post }, 201);
  }

  async putReplyHandler(request/* , h */) {
    const reply = this.container.resolve(getInstance(ReplyUseCase.name));
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    const result = await reply.updateReply(
      threadId,
      commentId,
      replyId,
      request.payload,
      credentialId,
    );
    return {
      status: 'success',
      message: 'Reply berhasil diperbarui',
      data: {
        editedReply: result,
      },
    };
  }

  async deleteReplyHandler(request/* , h */) {
    const reply = this.container.resolve(getInstance(ReplyUseCase.name));
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    await reply.deleteSoftReply(threadId, commentId, replyId, credentialId);
    return {
      status: 'success',
      message: 'Reply berhasil dihapus',
    };
  }
}

module.exports = RepliesHandler;
