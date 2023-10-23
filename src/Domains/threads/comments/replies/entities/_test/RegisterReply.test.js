/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const RegisterReply = require('../RegisterReply');

describe('a RegisterReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
    };

    // Action and Assert
    expect(() => new RegisterReply(payload)).toThrowError('REGISTER_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: {},
    };
    // Action and Assert
    expect(() => new RegisterReply(payload)).toThrowError('REGISTER_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  // it('should throw error when title is more than 255 characters', () => {
  //     // Arrange
  //     const payload = {
  //         content: 'abc',
  //     };
  // for (let i = 0; i<100; i++)
  //     payload.content+=payload.content;
  //     // Action and Assert
  //     expect(() => new RegisterReply(payload)).toThrowError('REGISTER_REPLY.TITLE_LIMIT_CHAR');
  // });
  it('should create registerReply object correctly', () => {
    // Arrange
    const payload = {
      // idComment: 'admin',
      content: 'Admin',
    };
    // Action
    const { /* idComment, */ content } = new RegisterReply(payload);
    // Assert
    // expect(idComment).toEqual(payload.idComment);
    expect(content).toEqual(payload.content);
  });
});
