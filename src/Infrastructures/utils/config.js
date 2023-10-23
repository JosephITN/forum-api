/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */

const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
    env: process.env.NODE_ENV,
  },
  database: {
    postgresql: {
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      pass: process.env.PGPASSWORD,
      dbname: process.env.PGDATABASE,
      port: process.env.PGPORT,
    },
    'postgresql:test': {
      user: process.env.PGUSER_TEST,
      host: process.env.PGHOST_TEST,
      pass: process.env.PGPASSWORD_TEST,
      dbname: process.env.PGDATABASE_TEST,
      port: process.env.PGPORT_TEST,
    },
  },
  jwt: {
    accessToken: process.env.ACCESS_TOKEN_KEY,
    refreshToken: process.env.REFRESH_TOKEN_KEY,
    ageToken: process.env.ACCESS_TOKEN_AGE,
    fields: {
      primary: 'forum_api_jwt',
    },
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
    fields: {
      primary: 'export:data',
    },
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
  s3: {
    bucketName: process.env.AWS_BUCKET_NAME,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

module.exports = config;
