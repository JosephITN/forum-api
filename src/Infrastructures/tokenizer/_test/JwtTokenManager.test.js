/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const { nanoid } = require('nanoid');
const random = require('crypto');
const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../JwtTokenManager');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('JwtTokenManager', () => {
  describe('access token function', () => {
    it('should generate access token correctly', async () => {
      const payload = { id: `users-${nanoid(16)}` };
      const environments = {
        accessTokenKey: random.randomBytes(64)
          .toString('hex'),
        refreshTokenKey: random.randomBytes(64)
          .toString('hex'),
      };
      // Arrange
      const spyToken = jest.spyOn(Jwt.token, 'generate');
      const jwtTokenManager = new JwtTokenManager({
        jwt: Jwt,
        accessTokenKey: environments.accessTokenKey,
        refreshTokenKey: environments.refreshTokenKey,
      });

      // Action
      const accessToken = await jwtTokenManager.generateAccessToken(payload);

      // Assert
      expect(typeof accessToken)
        .toEqual('string');
      expect(accessToken)
        .not
        .toEqual('plain_token');
      // default refresh token generation payload of user id and static refresh token key
      expect(spyToken)
        .toBeCalledWith(
          payload,
          environments.accessTokenKey,
        );
    });
  });
  describe('refresh token function', () => {
    it('should generate refresh token correctly', async () => {
      const payload = { id: `users-${nanoid(16)}` };
      const environments = {
        accessTokenKey: random.randomBytes(64)
          .toString('hex'),
        refreshTokenKey: random.randomBytes(64)
          .toString('hex'),
      };
      // Arrange
      const spyToken = jest.spyOn(Jwt.token, 'generate');
      const jwtTokenManager = new JwtTokenManager({
        jwt: Jwt,
        accessTokenKey: environments.accessTokenKey,
        refreshTokenKey: environments.refreshTokenKey,
      });

      // Action
      const refreshToken = await jwtTokenManager.generateRefreshToken(payload);

      // Assert
      expect(typeof refreshToken)
        .toEqual('string');
      expect(refreshToken)
        .not
        .toEqual('plain_token');
      // default refresh token generation payload of user id and static refresh token key
      expect(spyToken)
        .toBeCalledWith(
          payload,
          environments.refreshTokenKey,
        );
    });
  });
  describe('verify refresh token function', () => {
    it('should verify refresh token correctly', async () => {
      // Arrange
      // Action
      const payload = { id: `users-${nanoid(16)}` };
      const environments = {
        accessTokenKey: random.randomBytes(64)
          .toString('hex'),
        refreshTokenKey: random.randomBytes(64)
          .toString('hex'),
      };
      const spyToken = jest.spyOn(Jwt.token, 'generate');
      const jwtTokenManager = new JwtTokenManager({
        jwt: Jwt,
        accessTokenKey: environments.accessTokenKey,
        refreshTokenKey: environments.refreshTokenKey,
      });
      const refreshToken = await jwtTokenManager.generateRefreshToken(payload);

      // Assert
      expect(typeof refreshToken)
        .toEqual('string');
      expect(refreshToken)
        .not
        .toEqual('plain_token');
      // default refresh token generation payload of user id and static refresh token key
      expect(spyToken)
        .toBeCalledWith(
          payload,
          environments.refreshTokenKey,
        );

      // Arrange
      const decodeToken = jest.spyOn(Jwt.token, 'decode');
      const verifySignatureToken = jest.spyOn(Jwt.token, 'verifySignature');

      // Action
      const verifyToken = await jwtTokenManager.verifyRefreshToken(refreshToken);

      // Assert
      expect(typeof verifyToken)
        .toEqual('object');
      expect(verifyToken)
        .not
        .toEqual('plain_token');
      const { id } = verifyToken;
      expect(id)
        .not
        .toEqual(refreshToken);
      // default refresh token generation payload of user id and static refresh token key
      expect(decodeToken)
        .toBeCalledWith(refreshToken);
      const artifacts = Jwt.token.decode(refreshToken);
      expect(verifySignatureToken)
        .toBeCalledWith(
          artifacts,
          environments.refreshTokenKey,
        );
    });
    it('should return error when invalid token', async () => {
      // Arrange
      // Action
      const payload = { id: `users-${nanoid(16)}` };
      const environments = {
        accessTokenKey: random.randomBytes(64)
          .toString('hex'),
        refreshTokenKey: random.randomBytes(64)
          .toString('hex'),
      };
      const spyToken = jest.spyOn(Jwt.token, 'generate');
      const jwtTokenManager = new JwtTokenManager({
        jwt: Jwt,
        accessTokenKey: environments.accessTokenKey,
        refreshTokenKey: environments.refreshTokenKey,
      });
      const refreshToken = await jwtTokenManager.generateRefreshToken(payload);

      // Assert
      expect(typeof refreshToken)
        .toEqual('string');
      expect(refreshToken)
        .not
        .toEqual('plain_invalid_token');
      // default refresh token generation payload of user id and static refresh token key
      expect(spyToken)
        .toBeCalledWith(
          payload,
          environments.refreshTokenKey,
        );

      // Action
      const invalidToken = 'dpw8er0jsf'// noise
                + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'// header
                + 'eyJpZCI6InVzZXItQTh2ZXBjaV9ydWlUeDVGYyIsImlhdCI6MTY5MjA5OTUxNX0.'// payload
                + 'eqOhaabZ-Vd9e7p5vexUSyIbfGKI7QtaBcnYplWPDS0';// signature
      // Assert
      await expect(() => jwtTokenManager.verifyRefreshToken(invalidToken))
        .toThrowError(InvariantError);
    });
  });
  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      const environments = {
        accessTokenKey: random.randomBytes(64)
          .toString('hex'),
        refreshTokenKey: random.randomBytes(64)
          .toString('hex'),
      };
      // Arrange
      const jwtTokenManager = new JwtTokenManager({
        jwt: Jwt,
        accessTokenKey: environments.accessTokenKey,
        refreshTokenKey: environments.refreshTokenKey,
      });
      const accessToken = await jwtTokenManager.generateAccessToken({ username: 'admin' });

      // Action
      const { username: expectedUsername } = await jwtTokenManager.decodePayload(accessToken);

      // Action & Assert
      expect(expectedUsername)
        .toEqual('admin');
    });
  });
});
