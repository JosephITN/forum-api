/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
class RegisteredThread {
  constructor(payload) {
    RegisteredThread.verifyPayload(payload);

    const {
      id, title, body, owner,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  static verifyPayload({
    id, title, body, owner,
  }) {
    if (!id || !title || !body || !owner) {
      throw new Error('REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new Error('REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisteredThread;
