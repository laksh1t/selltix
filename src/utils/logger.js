const pino = require('pino');
// We cannot require config here if it creates a circular dependency or fails early. 
// But env is standalone, so it is safe.
const config = require('../config/env');

const logger = pino({
  level: config.LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

module.exports = { logger };
