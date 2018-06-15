const jwt = require('jsonwebtoken');

module.exports = (data, options = {}) => jwt.sign(data, 'TEST', options);
