const { hashSync } = require('bcryptjs');

module.exports = [
  {
    id: 1,
    login: 'user',
    password: hashSync('user'),
  },
  {
    id: 2,
    login: 'user2',
    password: hashSync('user2'),
  },
];
