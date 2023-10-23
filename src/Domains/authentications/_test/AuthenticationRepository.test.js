/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */

const AuthenticationRepository = require('../AuthenticationRepository');

describe('AuthenticationRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const authenticationRepository = new AuthenticationRepository();

    // Action and Assert
    await expect(authenticationRepository.addRefreshToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(authenticationRepository.verifyRefreshToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(authenticationRepository.deleteRefreshToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
