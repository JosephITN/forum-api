/* eslint-disable no-undef */
const AuthenticationError = require('../AuthenticationError');

describe('AuthenticationError', () => {
  it('should create AuthenticationError correctly', () => {
    const authenticationError = new AuthenticationError('authentications error!');

    expect(authenticationError.statusCode).toEqual(401);
    expect(authenticationError.message).toEqual('authentications error!');
    expect(authenticationError.name).toEqual('AuthenticationError');
  });
});
