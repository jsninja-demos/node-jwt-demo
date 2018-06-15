const { resolve } = require('path');
const { reject, find: findEntry } = require('lodash');
const config = require('../config');
// eslint-disable-next-line import/no-dynamic-require
let tokens = require(resolve(
  __dirname,
  '..',
  '..',
  config.connection,
  'refreshTokens'
));

async function find(query) {
  return findEntry(tokens, query);
}

async function add(entry) {
  tokens.push(entry);
}

async function remove(query) {
  tokens = reject(tokens, query);
}

module.exports = {
  find,
  add,
  remove,
};
