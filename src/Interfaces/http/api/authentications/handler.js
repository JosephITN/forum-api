/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const { successResponse/* , failResponse */ } = require('../../../../Infrastructures/utils/response');
const AuthenticationUseCase = require('../../../../Applications/services/authentications/AuthenticationUseCase');
const { getInstance } = require('../../../../Infrastructures/utils/helpers');

class AuthenticationsHandler {
  constructor(container) {
    this.container = container;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    const authentication = this.container.resolve(getInstance(AuthenticationUseCase.name));
    const post = await authentication.postAuthentication(request.payload);
    return successResponse(h, 'Authentication berhasil ditambahkan', post, 201);
  }

  async putAuthenticationHandler(request/* , h */) {
    const authentication = this.container.resolve(getInstance(AuthenticationUseCase.name));
    const { refreshToken } = request.payload;
    const accessToken = await authentication.putAuthentication({ token: refreshToken });
    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request/* , h */) {
    const authentication = this.container.resolve(getInstance(AuthenticationUseCase.name));
    const { refreshToken } = request.payload;
    await authentication.deleteAuthentication({ token: refreshToken });
    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;
