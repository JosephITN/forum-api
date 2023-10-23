/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const CommentsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'comments',
  register: async (server, { container }) => {
    const commentsHandler = new CommentsHandler(container);
    server.route(routes(commentsHandler));
  },
};
