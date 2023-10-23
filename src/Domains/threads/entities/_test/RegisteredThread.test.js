/*
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const RegisteredThread = require('../RegisteredThread');

describe('a RegisteredThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
    };

    // Action and Assert
    expect(() => new RegisteredThread(payload)).toThrowError('REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'abc',
      body: {},
      owner: 'user-123',
    };
    // Action and Assert
    expect(() => new RegisteredThread(payload)).toThrowError('REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create registeredThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      owner: 'user-123',
    };
    // Action
    const {
      id, title, body, owner,
    } = new RegisteredThread(payload);
    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
