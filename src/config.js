const rc = require('rc');

module.exports = rc('JWT', {
  port: process.env.PORT || 3000,
  connection: './data',
});
