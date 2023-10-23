/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const consoleAsync = {
  error: (message, ...optionalParams) => new Promise((resolve) => {
    setTimeout(() => {
      console.error(message, ...optionalParams);
      resolve();
    }, 0);
  }),
  log: (message, ...optionalParams) => new Promise((resolve) => {
    setTimeout(() => {
      console.log(message, ...optionalParams);
      resolve();
    }, 0);
  }),
  info: (message, ...optionalParams) => new Promise((resolve) => {
    setTimeout(() => {
      console.info(message, ...optionalParams);
      resolve();
    }, 0);
  }),
  warn: (message, ...optionalParams) => new Promise((resolve) => {
    setTimeout(() => {
      console.warn(message, ...optionalParams);
      resolve();
    }, 0);
  }),
  table: (tabularData, properties) => new Promise((resolve) => {
    setTimeout(() => {
      console.table(tabularData, properties);
      resolve();
    }, 0);
  }),
};

// const consoleAsync = {
//     error: async (message, ...optionalParams) => {
//         await setTimeout(() => {
//             console.error(message, optionalParams);
//         }, 0);
//     },
//     log: async (message, ...optionalParams) => {
//         await setTimeout(() => {
//             console.log(message, optionalParams);
//         }, 0);
//     },
//     table: async (message, ...optionalParams) => {
//         await setTimeout(() => {
//             console.table(message, optionalParams);
//         }, 0);
//     },
// };

module.exports = consoleAsync;
