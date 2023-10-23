/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const RegisteredComment = require('../RegisteredComment');

describe('a RegisteredComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
    };

    // Action and Assert
    expect(() => new RegisteredComment(payload)).toThrowError('REGISTERED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: {},
      owner: 'user-123',
    };
    // Action and Assert
    expect(() => new RegisteredComment(payload)).toThrowError('REGISTERED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create registeredComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'Admin',
      owner: 'user-123',
    };
    // Action
    const { id, content, owner } = new RegisteredComment(payload);
    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
