/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
/**
 * Get instance name following lower camel case rule such as were in Airbnb,
 * Google Javascript Style, Node.js and Hapi Style Guides, and Prettier
 * @param as
 * @returns {string}
 */
const getInstance = (as) => as.charAt(0).toLowerCase() + as.slice(1);

/**
 * Encapsulate transaction query
 * @param pool
 * @param transactionCallback
 * @param {boolean} useSerializableIsolation run 'READ COMMITTED' if it were set to true
 * @returns {Promise<*>}
 */
async function runTransaction(pool, transactionCallback, useSerializableIsolation = false) {
  const client = await pool.connect();
  try {
    await client.query(`BEGIN ${useSerializableIsolation ? 'ISOLATION LEVEL SERIALIZABLE' : ''}`);
    const result = await transactionCallback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { getInstance, runTransaction };
