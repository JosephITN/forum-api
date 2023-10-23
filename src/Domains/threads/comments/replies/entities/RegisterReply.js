/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
class RegisterReply {
  constructor(payload) {
    RegisterReply.verifyPayload(payload);

    const { content } = payload;

    this.content = content;
  }

  static verifyPayload({ content }) {
    if (!content) {
      throw new Error('REGISTER_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('REGISTER_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisterReply;
