/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');

class UserUseCase {
  constructor({ userRepository, bcryptPasswordHash }) {
    this.userRepository = userRepository;
    this.bcryptPasswordHash = bcryptPasswordHash;
  }

  async store(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this.userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password = await this.bcryptPasswordHash.hash(registerUser.password);
    return this.userRepository.addUser(registerUser);
  }
}

module.exports = UserUseCase;
