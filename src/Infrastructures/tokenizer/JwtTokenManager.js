/*
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const TokenManager = require('../../Applications/tokenizer/TokenManager');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class JwtTokenManager extends TokenManager {
  constructor({
    jwt,
    accessTokenKey,
    refreshTokenKey,
  }) {
    super();
    this.jwt = jwt;
    this.accessTokenKey = accessTokenKey;
    this.refreshTokenKey = refreshTokenKey;
  }

  generateAccessToken = (payload) => this.jwt.token.generate(payload, this.accessTokenKey);

  generateRefreshToken = (payload) => this.jwt.token.generate(payload, this.refreshTokenKey);

  verifyRefreshToken = (refreshToken) => {
    try {
      const artifacts = this.jwt.token.decode(refreshToken);
      this.jwt.token.verifySignature(artifacts, this.refreshTokenKey);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('refresh token tidak valid');
    }
  };

  decodePayload = (refreshToken) => {
    const artifacts = this.jwt.token.decode(refreshToken);
    return artifacts.decoded.payload;
  };
}

module.exports = JwtTokenManager;
