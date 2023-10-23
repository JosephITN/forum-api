/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
class RegisterComment {
  constructor(payload) {
    RegisterComment.verifyPayload(payload);

    const { content } = payload;

    this.content = content;
  }

  static verifyPayload({ content }) {
    if (!content) {
      throw new Error('REGISTER_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('REGISTER_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisterComment;
