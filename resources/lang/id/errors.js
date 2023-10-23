/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
module.exports = {
  // user
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': 'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': 'tidak dapat membuat user baru karena tipe data tidak sesuai',
  'REGISTER_USER.USERNAME_LIMIT_CHAR': 'tidak dapat membuat user baru karena karakter username melebihi batas limit',
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': 'tidak dapat membuat user baru karena username mengandung karakter terlarang',
  // authentication
  'REGISTER_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY': 'harus mengirimkan username dan password',
  'REGISTER_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION': 'username dan password harus string',
  'REGISTER_TOKEN.NOT_CONTAIN_REFRESH_TOKEN': 'harus mengirimkan token refresh',
  'REGISTER_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION': 'refresh token harus string',
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': 'harus mengirimkan token refresh',
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': 'refresh token harus string',
  // thread
  'REGISTER_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': 'properti thread tidak lengkap',
  'REGISTER_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': 'tipe data properti thread harus berupa string',
  'REGISTER_THREAD.TITLE_LIMIT_CHAR': 'data judul thread melebihi batas maksismum 50 karakter',
  'REGISTER_THREAD_ID.NOT_CONTAIN_NEEDED_PROPERTY': 'properti id harus ada',
  'REGISTER_THREAD_ID.NOT_MEET_DATA_TYPE_SPECIFICATION': 'tipe data id harus berupa string',
  'REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': 'harus mengirimkan id, title, body, dan owner',
  'REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': 'id, title, body, dan owner harus string',
  // comment
  'REGISTER_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': 'properti comment tidak lengkap',
  'REGISTER_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': 'properti comment harus berupa string',
  'REGISTERED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': 'harus mengirimkan id, content, dan owner',
  'REGISTERED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': 'id, content, dan owner harus string',
  // reply
  'REGISTER_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': 'properti reply tidak lengkap',
  'REGISTER_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': 'properti reply harus berupa string',
  'REGISTERED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': 'harus mengirimkan id, content, dan owner',
  'REGISTERED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': 'id, content, dan owner harus string',
};
