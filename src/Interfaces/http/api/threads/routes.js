const config = require('../../../../Infrastructures/utils/config');
/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: config.jwt.fields.primary,
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadHandler,
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}',
    handler: handler.putThreadHandler,
    options: {
      auth: config.jwt.fields.primary,
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}',
    handler: handler.deleteThreadHandler,
    options: {
      auth: config.jwt.fields.primary,
    },
  },
];

module.exports = routes;
