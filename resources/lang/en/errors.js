/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
module.exports = {
  // user
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': 'cannot create a new user because the required property is missing',
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': 'cannot create new user because the data type does not match',
  'REGISTER_USER.USERNAME_LIMIT_CHAR': 'cannot create a new user because the username characters exceed the limit',
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': 'cannot create a new user because the username contains prohibited characters',
  // authentication
  'REGISTER_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY': 'must submit username and password',
  'REGISTER_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION': 'username and password must be strings',
  'REGISTER_TOKEN.NOT_CONTAIN_REFRESH_TOKEN': 'must send refresh token',
  'REGISTER_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION': 'refresh token must be string',
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': 'must send refresh token',
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': 'refresh token must be string',
  // thread
  'REGISTER_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': 'incomplete thread property',
  'REGISTER_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': 'thread property data type must be string',
  'REGISTER_THREAD.TITLE_LIMIT_CHAR': 'Thread title data exceeds the maximum limit of 50 characters',
  'REGISTER_THREAD_ID.NOT_CONTAIN_NEEDED_PROPERTY': 'id property must exist',
  'REGISTER_THREAD_ID.NOT_MEET_DATA_TYPE_SPECIFICATION': 'id data type must be string',
  'REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': 'must send id, title, body and owner',
  'REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': 'id, title, body and owner must be string',
  // comments
  'REGISTER_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': 'comment property incomplete',
  'REGISTER_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': 'comment property must be a string',
  'REGISTERED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': 'must send id, content, and owner',
  'REGISTERED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': 'id, content, and owner must be string',
  // reply
  'REGISTER_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': 'incomplete reply property',
  'REGISTER_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': 'reply property must be a string',
  'REGISTERED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': 'must send id, content, and owner',
  'REGISTERED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': 'id, content, and owner must be string',
};
