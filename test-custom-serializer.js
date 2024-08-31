const pino = require('pino');

const log = pino({
  serializers: {
    mysql: (mysql) => ({
      createConnection: typeof mysql.createConnection,
      createPool: typeof mysql.createPool,
      escape: typeof mysql.escape,
      // Add other properties you need here
    })
  }
});

const mysql = require("mysql2/promise");

log.info({ mysql }, "mysql");
log.debug("test-pino:-");

