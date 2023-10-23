const config = require('../../../../../Infrastructures/utils/config');
/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentHandler,
    options: {
      auth: config.jwt.fields.primary,
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.putCommentHandler,
    options: {
      auth: config.jwt.fields.primary,
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.likeCommentHandler,
    options: {
      auth: config.jwt.fields.primary,
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentHandler,
    options: {
      auth: config.jwt.fields.primary,
    },
  },
];

module.exports = routes;
