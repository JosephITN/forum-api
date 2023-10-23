/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const { successResponse } = require('../../../../Infrastructures/utils/response');
const ThreadUseCase = require('../../../../Applications/services/threads/ThreadUseCase');
const { getInstance } = require('../../../../Infrastructures/utils/helpers');

class ThreadsHandler {
  constructor(container) {
    this.container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.putThreadHandler = this.putThreadHandler.bind(this);
    this.deleteThreadHandler = this.deleteThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const thread = this.container.resolve(getInstance(ThreadUseCase.name));
    const { id: credentialId } = request.auth.credentials;
    const post = await thread.storeThread(request.payload, credentialId);
    return successResponse(h, 'Thread berhasil ditambahkan', { addedThread: post }, 201);
  }

  async getThreadHandler(request/* , h */) {
    const thread = this.container.resolve(getInstance(ThreadUseCase.name));
    const { threadId } = request.params;
    const get = await thread.getThread(threadId);
    return {
      status: 'success',
      data: {
        thread: get,
      },
    };
  }

  async putThreadHandler(request/* , h */) {
    const thread = this.container.resolve(getInstance(ThreadUseCase.name));
    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;
    const result = await thread.updateThread(threadId, request.payload, credentialId);
    return {
      status: 'success',
      message: 'Thread berhasil diperbarui',
      data: {
        editedThread: result,
      },
    };
  }

  async deleteThreadHandler(request/* , h */) {
    const thread = this.container.resolve(getInstance(ThreadUseCase.name));
    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;
    await thread.deleteThread(threadId, credentialId);
    return {
      status: 'success',
      message: 'Thread berhasil dihapus',
    };
  }
}

module.exports = ThreadsHandler;
