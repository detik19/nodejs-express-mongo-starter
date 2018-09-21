'use strict';

const defaultEnvConfig = require('./default');

module.exports = {
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 
    'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/bwm-dev',
    options: {},
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  illegalUsernames: ['meanjs', 'administrator', 'password', 'admin', 'user',
  'unknown', 'anonymous', 'null', 'undefined', 'api']
}