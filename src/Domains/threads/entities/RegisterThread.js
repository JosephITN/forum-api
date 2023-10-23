/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
class RegisterThread {
  constructor(payload) {
    RegisterThread.verifyPayload(payload);

    const { title, body } = payload;

    this.title = title;
    this.body = body;
  }

  static verifyPayload({ title, body }) {
    if (!title || !body) {
      throw new Error('REGISTER_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('REGISTER_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (title.length > 50) {
      throw new Error('REGISTER_THREAD.TITLE_LIMIT_CHAR');
    }
  }
}

module.exports = RegisterThread;
