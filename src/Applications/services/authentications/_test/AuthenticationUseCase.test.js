/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const AuthenticationUseCase = require('../AuthenticationUseCase');
const AuthenticationRepository = require('../../../../Domains/authentications/AuthenticationRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const TokenManager = require('../../../tokenizer/TokenManager');
const PasswordHash = require('../../../security/PasswordHash');
const AuthenticationError = require('../../../../Commons/exceptions/AuthenticationError');

describe('Authentication', () => {
  it('should orchestrating authentication correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'admin',
      password: 'secret',
    };
    const mockId = 'user-123';
    const mockAuthenticated = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };
    // const mockRegisterAuthentication = new RegisterAuthentication(payload);
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockUserRepository = new UserRepository();
    const mockTokenManager = new TokenManager();
    const mockPasswordHash = new PasswordHash();

    /** mocking needed function */
    mockAuthenticationRepository.addRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.verifyUserCredential = jest.fn()
      .mockImplementation(() => Promise.resolve(mockId));
    mockUserRepository.getUserByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: mockId,
        password: '',
      }));
    mockPasswordHash.compare = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockTokenManager.generateAccessToken = jest.fn()
      .mockReturnValue(mockAuthenticated.accessToken);
    mockTokenManager.generateRefreshToken = jest.fn()
      .mockReturnValue(mockAuthenticated.refreshToken);

    /** creating use case instance */
    const mockAuthentication = new AuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      userRepository: mockUserRepository,
      jwtTokenManager: mockTokenManager,
      bcryptPasswordHash: mockPasswordHash,
    });
    // Action
    const authenticated = await mockAuthentication.postAuthentication(
      useCasePayload,
    );

    expect(authenticated)
      .toStrictEqual(mockAuthenticated);
    expect(mockUserRepository.getUserByUsername)
      .toBeCalledWith(
        useCasePayload.username,
      );
    // expect(mockUserRepository.verifyUserCredential)
    //     .toBeCalledWith(
    //         useCasePayload.username,
    //         useCasePayload.password,
    //     );
  });
  it('should throw AuthenticationError when incorrect password authentication', async () => {
    // Arrange
    const useCasePayload = {
      username: 'admin',
      password: 'wrong_secret',
    };
    const mockId = 'user-123';
    const mockAuthenticated = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };
    // const mockRegisterAuthentication = new RegisterAuthentication(payload);
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockUserRepository = new UserRepository();
    const mockTokenManager = new TokenManager();
    const mockPasswordHash = new PasswordHash();

    /** mocking needed function */
    mockAuthenticationRepository.addRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.verifyUserCredential = jest.fn()
      .mockImplementation(() => Promise.resolve(mockId));
    mockUserRepository.getUserByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: mockId,
        password: '',
      }));
    mockPasswordHash.compare = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    // mockTokenManager.generateAccessToken = jest.fn()
    //     .mockReturnValue(mockAuthenticated.accessToken);
    // mockTokenManager.generateRefreshToken = jest.fn()
    //     .mockReturnValue(mockAuthenticated.refreshToken);

    /** creating use case instance */
    const mockAuthentication = new AuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      userRepository: mockUserRepository,
      jwtTokenManager: mockTokenManager,
      bcryptPasswordHash: mockPasswordHash,
    });
    // Action
    await expect(mockAuthentication.postAuthentication(
      useCasePayload,
    )).rejects.toThrowError(AuthenticationError);
  });
  it('should re-orchestrating authentication correctly', async () => {
    // Arrange
    const useCasePayload = 'refresh_token';
    const mockId = 'user-123';
    const mockReAuthenticated = 'refresh_token_newer';

    /** creating dependency of use case */
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockUserRepository = new UserRepository();
    const mockTokenManager = new TokenManager();
    // const mockPasswordHash = new PasswordHash();

    /** mocking needed function */
    mockAuthenticationRepository.verifyRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockTokenManager.generateAccessToken = jest.fn()
      .mockReturnValue(mockReAuthenticated);
    mockTokenManager.decodePayload = jest.fn()
      .mockReturnValue({ id: mockId, username: 'username_dummy' });
    mockTokenManager.verifyRefreshToken = jest.fn()
      .mockReturnValue({ id: mockId });

    /** creating use case instance */
    const mockAuthentication = new AuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      userRepository: mockUserRepository,
      jwtTokenManager: mockTokenManager,
      bcryptPasswordHash: {},
    });

    // Action
    const authenticated = await mockAuthentication.putAuthentication({
      token: useCasePayload,
    });

    // Assert
    expect(authenticated)
      .toStrictEqual(mockReAuthenticated);
    expect(mockAuthenticationRepository.verifyRefreshToken)
      .toBeCalledWith(useCasePayload, 'refresh token tidak valid');
  });
  it('should dissolving authentication correctly', async () => {
    // Arrange
    const useCasePayload = 'refresh_token';

    /** creating dependency of use case */
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockUserRepository = new UserRepository();
    const mockTokenManager = new TokenManager();

    /** mocking needed function */
    mockAuthenticationRepository.verifyRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const mockAuthentication = new AuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      userRepository: mockUserRepository,
      jwtTokenManager: mockTokenManager,
    });

    // Action
    const authenticated = await mockAuthentication.deleteAuthentication({
      token: useCasePayload,
    });

    // Assert
    expect(authenticated)
      .toStrictEqual(true);
    expect(mockAuthenticationRepository.verifyRefreshToken)
      .toBeCalledWith(useCasePayload);
    expect(mockAuthenticationRepository.deleteRefreshToken)
      .toBeCalledWith(useCasePayload);
  });
  it('should failed dissolving authentication when token not available', async () => {
    /** creating dependency of use case */
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockUserRepository = new UserRepository();
    const mockTokenManager = new TokenManager();

    /** creating use case instance */
    const mockAuthentication = new AuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      userRepository: mockUserRepository,
      jwtTokenManager: mockTokenManager,
    });

    // Action & Assert
    await expect(mockAuthentication.deleteAuthentication({}))
      .rejects.toThrowError();
  });
  it('should failed dissolving authentication when token incorrect type', async () => {
    /** creating dependency of use case */
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockUserRepository = new UserRepository();
    const mockTokenManager = new TokenManager();

    /** creating use case instance */
    const mockAuthentication = new AuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      userRepository: mockUserRepository,
      jwtTokenManager: mockTokenManager,
    });

    // Action & Assert
    await expect(mockAuthentication.deleteAuthentication({ token: {} }))
      .rejects.toThrowError();
  });
});
