/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const RegisterThreadId = require('../RegisterThreadId');

describe('a RegisterThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const queryId = undefined;

    // Action and Assert
    expect(() => new RegisterThreadId(queryId)).toThrowError('REGISTER_THREAD_ID.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const queryId = {};
    // Action and Assert
    expect(() => new RegisterThreadId(queryId)).toThrowError('REGISTER_THREAD_ID.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  // it('should throw error when id is more than 50 characters', () => {
  //     // Arrange
  //     const queryId = 'thread-sf0unjwqe8fn83zsd9f8mrt9zxcdfuhsHDSU97bSJHSLKDF908dASEYfdhhe8Hfsj';
  //     // Action and Assert
  //     expect(() => new RegisterThreadId(queryId))
  //      .toThrowError('REGISTER_THREAD_ID.ID_LIMIT_CHAR');
  // });
  it('should create registerThread object correctly', () => {
    // Arrange
    const queryId = 'thread-sf0unjwqe8fn83';
    // Action
    const { id } = new RegisterThreadId(queryId);
    // Assert
    expect(id).toEqual(queryId);
  });
});
