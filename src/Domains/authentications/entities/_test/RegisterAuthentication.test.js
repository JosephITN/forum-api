/* eslint-disable no-undef */
const RegisterAuthentication = require('../RegisterAuthentication');

describe('a RegisterAuthentication entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'abc',
    };

    // Action and Assert
    expect(() => new RegisterAuthentication(payload))
      .toThrowError('REGISTER_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'abc',
      password: true,
    };

    // Action and Assert
    expect(() => new RegisterAuthentication(payload))
      .toThrowError('REGISTER_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should throw error when username contains more than 50 character', () => {
    // Arrange
    const payload = {
      username: 'adminadminadminadminadminadminadminadminadminadminadmin',
      password: 'abc',
    };
    // Action and Assert
    expect(() => new RegisterAuthentication(payload))
      .toThrowError('REGISTER_AUTHENTICATION.USERNAME_LIMIT_CHAR');
  });
  it('should throw error when username contains restricted character', () => {
    // Arrange
    const payload = {
      username: 'ad min',
      password: 'abc',
    };
    // Action and Assert
    expect(() => new RegisterAuthentication(payload))
      .toThrowError('REGISTER_AUTHENTICATION.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
  });
  it('should create registerUser object correctly', () => {
    // Arrange
    const payload = {
      username: 'admin',
      password: 'abc',
    };
    // Action
    const {
      username,
      password,
    } = new RegisterAuthentication(payload);
    // Assert
    expect(username)
      .toEqual(payload.username);
    expect(password)
      .toEqual(payload.password);
  });
});
