class RegisterAuthentication {
  constructor({
    username,
    password,
  }) {
    if (!username || !password) {
      throw new Error('REGISTER_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('REGISTER_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (username.length > 50) {
      throw new Error('REGISTER_AUTHENTICATION.USERNAME_LIMIT_CHAR');
    }

    // if (!username.match(/^[a-zA-Z1-9_]+$/)) {
    if (!username.match(/^[\w]+$/)) {
      throw new Error('REGISTER_AUTHENTICATION.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
    }

    this.username = username;
    this.password = password;
  }
}

module.exports = RegisterAuthentication;
