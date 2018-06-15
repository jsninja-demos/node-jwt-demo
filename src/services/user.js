const { resolve } = require('path');
const { find: findEntry } = require('lodash');
const config = require('../config');
// eslint-disable-next-line import/no-dynamic-require
const users = require(resolve(
  __dirname,
  '..',
  '..',
  config.connection,
  'users'
));

async function find(query) {
  return findEntry(users, query);
}

async function list() {
  return users;
}

async function update(query, values) {
  const entry = find(query);
  if (entry) {
    Object.assign(entry, values);
  }
}

module.exports = {
  find,
  list,
  update,
};
