/* istanbul ignore file */
/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
// external agency
const Jwt = require('@hapi/jwt');
const {
  createContainer,
  asClass,
  asFunction,
  asValue,
} = require('awilix');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const { pool } = require('./database/postgres/pool');
const config = require('./utils/config');

// service (repository, helper, manager, & etc.)
const AuthenticationRepositoryPostgres = require('./repository/authentications/AuthenticationRepositoryPostgres');
const UserRepositoryPostgres = require('./repository/users/UserRepositoryPostgres');
const ThreadRepositoryPostgres = require('./repository/threads/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('./repository/threads/comments/CommentRepositoryPostgres');
const CommentUserLikeRepositoryPostgres = require('./repository/threads/comments/CommentUserLikeRepositoryPostgres');
const ReplyRepositoryPostgres = require('./repository/threads/comments/replies/ReplyRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const JwtTokenManager = require('./tokenizer/JwtTokenManager');

// User use case
const UserUseCase = require('../Applications/services/users/UserUseCase');
// Authentication use case
const AuthenticationUseCase = require('../Applications/services/authentications/AuthenticationUseCase');
// Thread use case
const ThreadUseCase = require('../Applications/services/threads/ThreadUseCase');
// Comment use case
const CommentUseCase = require('../Applications/services/threads/comments/CommentUseCase');
// Reply use case
const ReplyUseCase = require('../Applications/services/threads/comments/replies/ReplyUseCase');

const container = createContainer();

// Register a class as a singleton:
container.register({
  date: asFunction(() => new Date()),
  accessTokenKey: asValue(config.jwt.accessToken),
  refreshTokenKey: asValue(config.jwt.refreshToken),
  pool: asValue(pool),
  idGenerator: asValue(nanoid),
  bcrypt: asValue(bcrypt),
  saltRound: asValue(10),
  jwt: asValue(Jwt),
  authenticationRepository: asClass(AuthenticationRepositoryPostgres)
    .singleton(),
  userRepository: asClass(UserRepositoryPostgres)
    .singleton(),
  threadRepository: asClass(ThreadRepositoryPostgres)
    .singleton(),
  commentRepository: asClass(CommentRepositoryPostgres)
    .singleton(),
  commentUserLikeRepository: asClass(CommentUserLikeRepositoryPostgres)
    .singleton(),
  replyRepository: asClass(ReplyRepositoryPostgres)
    .singleton(),
  bcryptPasswordHash: asClass(BcryptPasswordHash)
    .singleton(),
  jwtTokenManager: asClass(JwtTokenManager)
    .singleton(),
});

// Register factories or functions:
container.register({
  userUseCase: asClass(UserUseCase),
  authenticationUseCase: asClass(AuthenticationUseCase),
  threadUseCase: asClass(ThreadUseCase),
  commentUseCase: asClass(CommentUseCase),
  replyUseCase: asClass(ReplyUseCase),
});

module.exports = container;
