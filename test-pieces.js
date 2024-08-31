const pino = require('pino');

const log = pino();

const mysql = require("mysql2/promise");

log.info({
  createConnection: typeof mysql.createConnection,
  createPool: typeof mysql.createPool,
  escape: typeof mysql.escape
}, "mysql");

log.debug("test-pino:-");
