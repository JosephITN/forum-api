/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const PasswordHash = require('../PasswordHash');

describe('PasswordHash interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const passwordHash = new PasswordHash();

    // Action & Assert
    await expect(passwordHash.hash('dummy_password')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
    await expect(passwordHash.compare('dummy_password', 'hashed_password')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  });
});
