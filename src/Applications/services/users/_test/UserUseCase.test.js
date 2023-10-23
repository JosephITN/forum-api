/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
/* eslint-disable no-undef */
const RegisterUser = require('../../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../../Domains/users/UserRepository');
const PasswordHash = require('../../../security/PasswordHash');
const UserUseCase = require('../UserUseCase');

describe('UserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'admin',
      password: 'secret',
      fullname: 'Admin',
    };
    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    /** mocking needed function */
    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));

    /** creating use case instance */
    const getUserUseCase = new UserUseCase({
      userRepository: mockUserRepository,
      bcryptPasswordHash: mockPasswordHash,
    });

    // Action
    const registeredUser = await getUserUseCase.store(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual(new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    }));
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username);
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname,
    }));
  });
});
