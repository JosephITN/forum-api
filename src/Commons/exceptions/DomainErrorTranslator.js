/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */

const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  /**
   * Translate basic Error into proper and readable InvariantError
   * @param {Error} error
   * @param {string} lang default language for error message
   * @returns {InvariantError|*}
   */
  translate(error, lang = 'id') {
    /* eslint-disable import/no-dynamic-require, global-require */
    const dictionary = require(`../../../resources/lang/${lang}/errors`);
    /* eslint-enable import/no-dynamic-require, global-require */
    return (dictionary[error.message] ? new InvariantError(dictionary[error.message]) : error);
  },
};

module.exports = DomainErrorTranslator;
