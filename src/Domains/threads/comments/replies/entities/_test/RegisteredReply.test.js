/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const RegisteredReply = require('../RegisteredReply');

describe('a RegisteredReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
    };

    // Action and Assert
    expect(() => new RegisteredReply(payload)).toThrowError('REGISTERED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: {},
      owner: 'user-123',
    };
    // Action and Assert
    expect(() => new RegisteredReply(payload)).toThrowError('REGISTERED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create registeredReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'Admin',
      owner: 'user-123',
    };
    // Action
    const { id, content, owner } = new RegisteredReply(payload);
    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
