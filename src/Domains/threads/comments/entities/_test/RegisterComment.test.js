/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const RegisterComment = require('../RegisterComment');

describe('a RegisterThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
    };

    // Action and Assert
    expect(() => new RegisterComment(payload)).toThrowError('REGISTER_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: {},
    };
    // Action and Assert
    expect(() => new RegisterComment(payload)).toThrowError('REGISTER_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create registerComment object correctly', () => {
    // Arrange
    const payload = {
      // idThread: 'admin',
      content: 'Admin',
    };
    // Action
    const { /* idThread, */ content } = new RegisterComment(payload);
    // Assert
    // expect(idThread).toEqual(payload.idThread);
    expect(content).toEqual(payload.content);
  });
});
