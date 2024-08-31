const pino = require('pino');
const log = pino();

const mysql = require("mysql2/promise");

// Iterate over the first-level properties
// of an object and return them
function flp(obj) {
  const firstLevelProperties = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      firstLevelProperties[key] = typeof obj[key];
    }
  }

  return firstLevelProperties
}

console.log("mysql:", mysql);
log.info(flp(mysql), "flp(mysql)");

