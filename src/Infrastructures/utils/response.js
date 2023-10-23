/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */

/**
 * Success response, code between 200 - 299
 * @param header
 * @param message
 * @param data
 * @param code
 * @returns {*}
 */
function successResponse(header, message, data = null, code = 200) {
  const d = {
    status: 'success',
  };
  if (message) {
    d.message = message;
  }
  if (data) {
    d.data = data;
  }

  const response = header.response(d);
  // d.code = code;
  response.code(code);
  // response.header('Access-Control-Allow-Origin', '*');
  return response;
}

/**
 * Fail response, code between 400 - 499
 * @param header
 * @param message
 * @param code
 * @param data
 * @returns {*}
 */
function failResponse(header, message, code = 400, data = null) {
  const d = {
    status: 'fail',
    message,
  };
  if (data) {
    d.data = data;
  }

  const response = header.response(d);
  // d.code = code;
  response.code(code);
  // response.header('Access-Control-Allow-Origin', '*');
  return response;
}

/**
 * Error response, code between 500 - 599
 * @param header
 * @param message
 * @param code
 * @param data
 * @returns {*}
 */
function errorResponse(header, message, code = 500, data = null) {
  const d = {
    status: 'error',
    message,
  };
  if (data) {
    d.data = data;
  }

  const response = header.response(d);
  // d.code = code;
  response.code(code);
  // response.header('Access-Control-Allow-Origin', '*');
  return response;
}

module.exports = {
  successResponse,
  failResponse,
  errorResponse,
};
