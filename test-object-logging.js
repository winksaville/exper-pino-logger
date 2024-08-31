const pino = require('pino');

const log = pino();

const mysql = require("mysql2/promise");
console.log("mysql=%s", mysql);
//log.info(mysql, "mysql");

