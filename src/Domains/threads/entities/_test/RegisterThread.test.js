/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const RegisterThread = require('../RegisterThread');

describe('a RegisterThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
    };

    // Action and Assert
    expect(() => new RegisterThread(payload)).toThrowError('REGISTER_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'abc',
      body: {},
    };
    // Action and Assert
    expect(() => new RegisterThread(payload)).toThrowError('REGISTER_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should throw error when title is more than 50 characters', () => {
    // Arrange
    const payload = {
      title: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      body: 'abc',
    };
    // Action and Assert
    expect(() => new RegisterThread(payload)).toThrowError('REGISTER_THREAD.TITLE_LIMIT_CHAR');
  });
  it('should create registerThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'admin',
      body: 'Admin',
    };
    // Action
    const { title, body } = new RegisterThread(payload);
    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
