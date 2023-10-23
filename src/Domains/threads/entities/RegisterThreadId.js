/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
class RegisterThreadId {
  constructor(id) {
    RegisterThreadId.verifyPayload(id);

    this.id = id;
  }

  static verifyPayload(id) {
    if (!id) {
      throw new Error('REGISTER_THREAD_ID.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string') {
      throw new Error('REGISTER_THREAD_ID.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    // if (id.length > 50) {
    //     throw new Error('REGISTER_THREAD_ID.ID_LIMIT_CHAR');
    // }
  }
}

module.exports = RegisterThreadId;
