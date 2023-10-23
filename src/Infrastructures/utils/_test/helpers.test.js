/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const { getInstance, runTransaction } = require('../helpers');
const { pool } = require('../../database/postgres/pool');
const JwtTokenManager = require('../../tokenizer/JwtTokenManager');
const UserRepositoryPostgres = require('../../repository/users/UserRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('Instance name JwtTokenManager', () => {
  it('should return standard lower camel case instance aliasing correctly', async () => {
    expect(getInstance(JwtTokenManager.name)).toEqual('jwtTokenManager');
  });
});
describe('Run transaction safely', () => {
  beforeEach(async () => {
    // Needed for counter measurement since individual test run asynchronously,
    // that sometimes failed to run the test before completely delete all the data successfully
    await UsersTableTestHelper.deleteAll();
  });
  // afterEach(async () => {
  //   // Needed for counter measurement since individual test run asynchronously,
  //   // that sometimes failed to run the test before completely delete all the data successfully
  //   // await UsersTableTestHelper.truncate();
  //   await UsersTableTestHelper.deleteAll();
  // });

  afterAll(async () => {
    await pool.end();
  });
  it('should throw an error and rollback transaction correctly', async () => {
    await expect(runTransaction(pool, async (client) => {
      await client.query('DELETE FROM not_exists');
    })).rejects.toThrowError();
  });
  it('should run insert, update, delete smoothly', async () => {
    const userRepositoryPostgres = new UserRepositoryPostgres({
      pool, idGenerator: () => '123', bcryptPasswordHash: {},
    });
    await expect(runTransaction(pool, async () => userRepositoryPostgres.addUser({
      username: 'admin', password: 'secret', fullname: 'Admin ForumAPI',
    }))).resolves.not.toThrowError();
    await expect(runTransaction(pool, UsersTableTestHelper.deleteAll))
      .resolves.not.toThrowError();
  });
  it('should run insert and return the value correctly', async () => {
    const useCasePayload = {
      username: 'admin',
      fullname: 'Admin ForumAPI',
    };
    const userRepositoryPostgres = new UserRepositoryPostgres({
      pool, idGenerator: () => '123', bcryptPasswordHash: {},
    });
    const result = await runTransaction(pool, async () => userRepositoryPostgres.addUser({
      username: useCasePayload.username, password: 'secret', fullname: useCasePayload.fullname,
    }));
    // console.log(result);
    await expect(result)
      .toEqual({
        id: 'user-123',
        username: useCasePayload.username,
        fullname: useCasePayload.fullname,
      });
    await expect(runTransaction(
      pool,
      UsersTableTestHelper.deleteAll,
    )).resolves.not.toThrowError();
  });
});
