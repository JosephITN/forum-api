/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
require('dotenv').config();
const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');

const start = async () => {
  const server = await createServer(container);
  await server.start();
  console.log(`server start at ${server.info.uri}`);
};

start();
