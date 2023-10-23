/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const PasswordHash = require('../../Applications/security/PasswordHash');

class BcryptPasswordHash extends PasswordHash {
  constructor({
    bcrypt,
    saltRound = 10,
  }) {
    super();
    this.bcrypt = bcrypt;
    this.saltRound = saltRound;
    if (saltRound === null || saltRound === undefined) this.saltRound = 10;
  }

  async hash(password) {
    return this.bcrypt.hash(password, this.saltRound);
  }

  async compare(password, hashedPassword) {
    return this.bcrypt.compare(password, hashedPassword);
  }
}

module.exports = BcryptPasswordHash;
