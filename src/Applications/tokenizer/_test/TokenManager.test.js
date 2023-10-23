/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const { nanoid } = require('nanoid');
const TokenManager = require('../TokenManager');

describe('Token Manager interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const tokenManager = new TokenManager();
    const payload = { id: `users-${nanoid(16)}` };
    // Action & Assert
    // Synchronous task indicated by putting inside lambda function
    await expect(() => tokenManager.generateAccessToken(payload))
    // .resolves
      .toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const tokenManager = new TokenManager();
    const payload = { id: `users-${nanoid(16)}` };
    // Action & Assert
    // Synchronous task indicated by putting inside lambda function
    await expect(() => tokenManager.generateRefreshToken(payload))
    // .resolves
      .toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const tokenManager = new TokenManager();
    // Action & Assert
    // Synchronous task indicated by putting inside lambda function
    await expect(() => tokenManager.verifyRefreshToken('dummy_refresh_token'))
    // .resolves
      .toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const tokenManager = new TokenManager();
    // Action & Assert
    // Synchronous task indicated by putting inside lambda function
    await expect(() => tokenManager.decodePayload('dummy_refresh_token'))
      .toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });
});
