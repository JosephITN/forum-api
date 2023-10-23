/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const RegisterAuthentication = require('../../../Domains/authentications/entities/RegisterAuthentication');
const RegisterAuthenticationToken = require('../../../Domains/authentications/entities/RegisterAuthenticationToken');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

class AuthenticationUseCase {
  /**
     * Authentication constructor
     * @param object args {
     * authenticationRepository: AuthenticationRepositoryPostgres|object,
     * userRepository: UserRepositoryPostgres|object,
     * jwtTokenManager: JwtTokenManager|object,
     * }
     */
  constructor({
    authenticationRepository,
    userRepository,
    jwtTokenManager,
    bcryptPasswordHash,
  }) {
    this.authenticationRepository = authenticationRepository;
    this.userRepository = userRepository;
    this.jwtTokenManager = jwtTokenManager;
    this.bcryptPasswordHash = bcryptPasswordHash;
  }

  /**
     * @param {username: string|object, password: string|object} payload
     * @returns {Promise<{accessToken: string, refreshToken: string}>}
     */
  async postAuthentication(payload) {
    const { username, password } = new RegisterAuthentication(payload);
    // const id = await this.userRepository.verifyUserCredential(
    //     username,
    //     password,
    // );
    const { id, password: hashedPassword } = await this.userRepository.getUserByUsername(username);
    const result = await this.bcryptPasswordHash.compare(password, hashedPassword);
    if (!result) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }
    const accessToken = this.jwtTokenManager.generateAccessToken({ id, username });
    const refreshToken = this.jwtTokenManager.generateRefreshToken({ id, username });
    await this.authenticationRepository.addRefreshToken(refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
     * @param {token: object|string} payload refresh token
     * @returns {Promise<*|string>}
     */
  async putAuthentication(payload) {
    const { token } = payload;
    const registerAuthenticationToken = new RegisterAuthenticationToken(token);
    await this.authenticationRepository.verifyRefreshToken(
      registerAuthenticationToken.token,
      'refresh token tidak valid',
    );
    const { id } = this.jwtTokenManager.verifyRefreshToken(registerAuthenticationToken.token);
    const { username } = await this.jwtTokenManager.decodePayload(
      registerAuthenticationToken.token,
    );
    return this.jwtTokenManager.generateAccessToken({ id, username });
  }

  /**
     * @param {token: object|string} payload refresh token
     * @returns {Promise<boolean|true>}
     */
  async deleteAuthentication(payload) {
    const { token } = payload;
    this.validateDeleteToken(token);
    await this.authenticationRepository.verifyRefreshToken(token);
    await this.authenticationRepository.deleteRefreshToken(token);
    return true;
  }

  validateDeleteToken(token) {
    if (!token) {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof token !== 'string') {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AuthenticationUseCase;
