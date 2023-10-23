/* eslint-disable no-undef */
const RegisterAuthenticationToken = require('../RegisterAuthenticationToken');

describe('a registeredToken entity', () => {
  it('should throw error if content was not a string', () => {
    // Arrange
    const token = {};
    // Action and Assertion
    expect(() => new RegisterAuthenticationToken(token))
      .toThrowError('REGISTER_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should throw error if content was null', () => {
    // Arrange
    const token = null;
    // Action and Assertion
    expect(() => new RegisterAuthenticationToken(token))
      .toThrowError('REGISTER_TOKEN.NOT_CONTAIN_REFRESH_TOKEN');
  });
  it('should throw error if content was undefined', () => {
    // Arrange
    const token = undefined;
    // Action and Assertion
    expect(() => new RegisterAuthenticationToken(token))
      .toThrowError('REGISTER_TOKEN.NOT_CONTAIN_REFRESH_TOKEN');
  });
  it('should create RegisteredToken object correctly', () => {
    // Arrange
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItQTh2ZXBjaV9ydWlUeDVGYyIsImlhdCI6MTY5MjA5OTUxNX0.eqOhaabZ-Vd9e7p5vexUSyIbfGKI7QtaBcnYplWPDS0';

    const registerToken = new RegisterAuthenticationToken(token);
    // Assert
    expect(registerToken.token)
      .not
      .toEqual(undefined);
    expect(registerToken.token)
      .toEqual(token);
  });
});
