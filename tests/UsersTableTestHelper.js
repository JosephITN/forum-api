const { pool } = require('../src/Infrastructures/database/postgres/pool');

const UsersTableTestHelper = {
  async addUser({
    id = 'user-123',
    username = 'admin',
    password = 'secret',
    fullname = 'Admin',
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, password, fullname],
    };
    /* return */
    await pool.query(query);
  },

  async findUsersById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async truncate(cascade = false) {
    await pool.query(`TRUNCATE TABLE users${cascade ? ' CASCADE' : ''}`);
  },

  async deleteAll() {
    await pool.query('DELETE FROM users');
  },
};

module.exports = UsersTableTestHelper;
