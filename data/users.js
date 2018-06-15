const { hashSync } = require('bcryptjs');

module.exports = [
  {
    id: 1,
    login: 'Vasya',
    password: hashSync('Vasya'),
  },
  {
    id: 2,
    login: 'Petya',
    password: hashSync('Petya'),
  },
];
