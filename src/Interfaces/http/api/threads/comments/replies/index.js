/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const RepliesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'replies',
  register: async (server, { container }) => {
    const repliesHandler = new RepliesHandler(container);
    server.route(routes(repliesHandler));
  },
};
