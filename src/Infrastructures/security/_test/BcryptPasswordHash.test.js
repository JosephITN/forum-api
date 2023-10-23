/*
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../BcryptPasswordHash');

describe('BcryptPasswordHash', () => {
  describe('should persist default salt value', () => {
    it('should initiate salt round value correctly', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash({ bcrypt });

      // Assert
      expect(typeof bcryptPasswordHash.saltRound)
        .toEqual('number');
      expect(bcryptPasswordHash.saltRound)
        .toEqual(10);
    });

    it('should initiate salt round value correctly', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash({ bcrypt, saltRound: undefined });

      // Assert
      expect(typeof bcryptPasswordHash.saltRound)
        .toEqual('number');
      expect(bcryptPasswordHash.saltRound)
        .toEqual(10);
    });
    it('should initiate salt round value correctly', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash({ bcrypt, saltRound: null });

      // Assert
      expect(typeof bcryptPasswordHash.saltRound)
        .toEqual('number');
      expect(bcryptPasswordHash.saltRound)
        .toEqual(10);
    });
  });
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash({ bcrypt });

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      // Assert
      expect(typeof encryptedPassword)
        .toEqual('string');
      expect(encryptedPassword)
        .not
        .toEqual('plain_password');
      expect(spyHash)
        .toBeCalledWith('plain_password', 10); // 10 adalah nilai saltRound default untuk BcryptPasswordHash
    });
  });
  describe('compare function', () => {
    it('should compare password correctly', async () => {
      // Arrange
      const password = 'plain_password';
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash({ bcrypt });

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash(password);

      // Assert
      expect(typeof encryptedPassword)
        .toEqual('string');
      expect(encryptedPassword)
        .not
        .toEqual(password);
      // 10 adalah nilai saltRound default untuk BcryptPasswordHash
      expect(spyHash)
        .toBeCalledWith(password, 10);

      // Action
      const match = await bcryptPasswordHash.compare(password, encryptedPassword);

      // Assert
      expect(typeof match)
        .toEqual('boolean');
      expect(match).toEqual(true);
      // // 10 adalah nilai saltRound default untuk BcryptPasswordHash
      // expect(spyHash).toBeCalledWith('plain_password', 10);
    });
  });
});
