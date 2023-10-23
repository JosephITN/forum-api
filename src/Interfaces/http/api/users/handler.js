const { successResponse } = require('../../../../Infrastructures/utils/response');
const UserUseCase = require('../../../../Applications/services/users/UserUseCase');
const { getInstance } = require('../../../../Infrastructures/utils/helpers');

/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
class UsersHandler {
  constructor(container) {
    this.container = container;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    const addUserUseCase = this.container.resolve(getInstance(UserUseCase.name));
    const addedUser = await addUserUseCase.store(request.payload);
    return successResponse(h, null, { addedUser }, 201);
  }
}

module.exports = UsersHandler;
