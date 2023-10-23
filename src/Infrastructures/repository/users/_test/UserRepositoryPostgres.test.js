const bcrypt = require('bcrypt');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../../tests/RepliesTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');
const AuthenticationError = require('../../../../Commons/exceptions/AuthenticationError');
const RegisterUser = require('../../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../../Domains/users/entities/RegisteredUser');
const { pool } = require('../../../database/postgres/pool');
const BcryptPasswordHash = require('../../../security/BcryptPasswordHash');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const PostgreSqlTestHelper = require('../../../../../tests/PostgreSqlTestHelper');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    // await UsersTableTestHelper.truncate();
    await PostgreSqlTestHelper.runTransaction(async () => {
      await UsersTableTestHelper.deleteAll();
      await AuthenticationsTableTestHelper.deleteAll();
      await ThreadsTableTestHelper.deleteAll();
      await CommentsTableTestHelper.deleteAll();
      await RepliesTableTestHelper.deleteAll();
      // await PostgreSqlTestHelper.truncateAll()
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'admin',
      }); // memasukan user baru dengan username admin
      const userRepositoryPostgres = new UserRepositoryPostgres({
        pool,
        idGenerator: {},
        bcryptPasswordHash: {},
      });

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('admin'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres({
        pool,
        idGenerator: {},
        bcryptPasswordHash: {},
      });

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('admin'))
        .resolves
        .not
        .toThrowError(InvariantError);
    });
  });
  describe('addUser function', () => {
    it('should persist register user', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'admin',
        password: 'secret_password',
        fullname: 'Admin',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
        bcryptPasswordHash: {},
      });

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users)
        .toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'admin',
        password: 'secret_password',
        fullname: 'Admin',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
        bcryptPasswordHash: {},
      });

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser)
        .toStrictEqual(new RegisteredUser({
          id: 'user-123',
          username: 'admin',
          fullname: 'Admin',
        }));
    });
  });
  describe('getUserByUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres({
        pool,
        idGenerator: {},
        bcryptPasswordHash: {},
      });

      // Action & Assert
      await expect(userRepositoryPostgres.getUserByUsername('admin'))
        .rejects
        .toThrowError(InvariantError);
    });
    it('should get user id and password', async () => {
      // Arrange
      const id = 'user-7cLWanISBHLehItS';
      const bcryptPasswordHash = new BcryptPasswordHash({ bcrypt, saltRound: 10 });
      const encryptedPassword = await bcryptPasswordHash.hash('secret1');
      // Arrange
      const result = await UsersTableTestHelper.addUser({
        id,
        username: 'admin',
        password: encryptedPassword,
        fullname: 'Admin',
      }); // memasukan user baru dengan username admin
      // await expect(result.rowCount).toEqual(1);
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres({
        pool,
        idGenerator: {},
        bcryptPasswordHash: {},
      });

      // Action & Assert
      await expect(userRepositoryPostgres.getUserByUsername('admin'))
        .resolves
        .not
        .toThrowError(InvariantError);
      const user = await userRepositoryPostgres.getUserByUsername('admin');
      await expect(user)
        .toHaveProperty('id');
      await expect(user)
        .toHaveProperty('password');
      await expect(user.id)
        .toEqual(id);
      await expect(user.password)
        .toEqual(encryptedPassword);
    });
  });
  describe('verifyUsernameCredential function', () => {
    it('should throw AuthenticationError when combination username and wrong password', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash({ bcrypt });
      const encryptedPassword = await bcryptPasswordHash.hash('secret1');

      await UsersTableTestHelper.addUser({
        id: 'user-7cLWanISBHLehItS', // `user-${nanoid(16)}`,
        username: 'admin',
        password: encryptedPassword,
        fullname: 'Admin',
      }); // memasukan user baru dengan username admin

      // Arrange
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
        bcryptPasswordHash,
      });

      // Action & Assert
      await expect(userRepositoryPostgres.verifyUserCredential('admin', 'secret'))
        .rejects
        .toThrowError(AuthenticationError);
    });
    it('should throw AuthenticationError when combination wrong username and password or not available in database', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash({ bcrypt });
      const encryptedPassword = await bcryptPasswordHash.hash('secret');

      await UsersTableTestHelper.addUser({
        id: 'user-7cLWanISBHLehItS',
        username: 'admin1',
        password: encryptedPassword,
        fullname: 'Admin 1',
      }); // memasukan user baru dengan username admin

      // Arrange
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
        bcryptPasswordHash,
      });

      // Action & Assert
      await expect(userRepositoryPostgres.verifyUserCredential('admin', 'secret'))
        .rejects
        .toThrowError(AuthenticationError);
    });
    it('should not throw AuthenticationError when correct', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash({ bcrypt });
      const encryptedPassword = await bcryptPasswordHash.hash('secret');

      await expect(UsersTableTestHelper.addUser({
        id: 'user-7cLWanISBHLehItS',
        username: 'admin2',
        password: encryptedPassword,
        fullname: 'Admin 2',
      }))
        .resolves
        .not
        .toThrowError(Error);

      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
        bcryptPasswordHash,
      });

      // Action & Assert
      await expect(userRepositoryPostgres.verifyUserCredential('admin2', 'secret'))
        .resolves
        .not
        .toThrowError(AuthenticationError);
    });
  });
});
