/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
class TokenManager {
  generateAccessToken = (payload) => {
    throw new Error('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  };

  generateRefreshToken = (payload) => {
    throw new Error('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  };

  verifyRefreshToken = (refreshToken) => {
    throw new Error('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  };

  decodePayload = (refreshToken) => {
    throw new Error('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  };
}

module.exports = TokenManager;
