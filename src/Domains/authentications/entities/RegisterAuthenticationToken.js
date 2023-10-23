class RegisterAuthenticationToken {
  constructor(token) {
    RegisterAuthenticationToken.verifyTokenVariable(token);

    this.token = token;
  }

  static verifyTokenVariable(token, errorMessages = [
    'REGISTER_TOKEN.NOT_CONTAIN_REFRESH_TOKEN',
    'REGISTER_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION',
  ]) {
    if (!token) throw new Error(errorMessages[0]);
    if (typeof token !== 'string') throw new Error(errorMessages[1]);
  }
}

module.exports = RegisterAuthenticationToken;
