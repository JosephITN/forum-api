/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const config = require('../utils/config');
const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');
const authentications = require('../../Interfaces/http/api/authentications');
const users = require('../../Interfaces/http/api/users');
const threads = require('../../Interfaces/http/api/threads');
const comments = require('../../Interfaces/http/api/threads/comments');
const replies = require('../../Interfaces/http/api/threads/comments/replies');
const { failResponse, errorResponse } = require('../utils/response');

const createServer = async (container) => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy(config.jwt.fields.primary, 'jwt', {
    keys: config.jwt.accessToken,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.ageToken,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  const options = { container };

  await server.register([
    {
      plugin: authentications,
      options,
    },
    {
      plugin: users,
      options,
    },
    {
      plugin: threads,
      options,
    },
    {
      plugin: comments,
      options,
    },
    {
      plugin: replies,
      options,
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // get response context from requests
    const { response } = request;
    if (response instanceof Error) {
      // if there are error, handle it with proper listed InvariantError
      const translatedError = DomainErrorTranslator.translate(response);
      // handle client error internally.
      if (translatedError instanceof ClientError) {
        return failResponse(h, translatedError.message, translatedError.statusCode);
      }
      // persist client error handling by Hapi natively, like 404, etc.
      if (!translatedError.isServer) {
        return h.continue;
      }
      console.error(request.response);
      // handle server error
      return errorResponse(h, 'terjadi kegagalan pada server kami', 500);
    }
    // if not an error continue the response
    return h.continue;
  });

  return server;
};

module.exports = createServer;
