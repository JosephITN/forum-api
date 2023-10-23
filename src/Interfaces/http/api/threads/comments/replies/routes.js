const config = require('../../../../../../Infrastructures/utils/config');
/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postReplyHandler,
    options: {
      auth: config.jwt.fields.primary,
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: handler.putReplyHandler,
    options: {
      auth: config.jwt.fields.primary,
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: handler.deleteReplyHandler,
    options: {
      auth: config.jwt.fields.primary,
    },
  },
];

module.exports = routes;
