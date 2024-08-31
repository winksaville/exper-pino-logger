const pino = require('pino');
const log = pino();

const mysql = require("mysql2/promise");

// Iterate over the first-level properties of the mysql object
const firstLevelProperties = {};
for (const key in mysql) {
  if (mysql.hasOwnProperty(key)) {
    firstLevelProperties[key] = typeof mysql[key];
  }
}

console.log("First-level properties:", firstLevelProperties);
log.info(firstLevelProperties, "First-level properties of mysql object");

log.debug("test-pino:-");

