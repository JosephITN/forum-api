const { pool } = require('../src/Infrastructures/database/postgres/pool');

const AuthenticationsTableTestHelper = {
  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await pool.query(query);
  },

  async findRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await pool.query(query);

    return result.rows;
  },
  async truncate() {
    await pool.query('TRUNCATE TABLE authentications RESTART IDENTITY CASCADE');
  },
  async deleteAll() {
    await pool.query('DELETE FROM authentications');
  },
};

module.exports = AuthenticationsTableTestHelper;
