const pino = require('pino');

const log = pino({
  serializers: {
    mysql: (obj) => {
      return flp(obj);
    }
  }
});

// Iterate over the first-level properties of an object
// and return them as associative array object.
function flp(obj) {
  console.log("flp:+");
  console.trace();
  //console.log("flpSerializer:- obj", obj);
  let result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = typeof obj[key];
      //console.log("flpSerializer: key=%s result[key]=%s", key, result[key]);
    }
  }

  console.log("flp:- result", result);
  return result
}

const mysql = require("mysql2/promise");
const { wildcardFirstSym } = require('pino/lib/symbols');

//console.log("test-pino: 0");
//log.info({ mysql }, "mysql");

//a_number = 123;
//console.log("test-pino: a_number", a_number);
//log.info("with d a_number=%d", a_number);
//log.info({ a_number }, "a_number");

log.info(flp(mysql), "mysql");
log.info({ mysql }, "mysql");
log.info({ mysql });
log.info("mysql=%o", mysql);

//a_object = { "a bc": 1 };
//log.info(a_object);
//log.info(a_object, "a_object");
//log.info({ a_object });
//log.info({ a_object }, "a_object");
//log.info("a_object=%o", a_object);
//console.log("a_object=%o", a_object);
//
//b_object = { aobj: a_object, b: 2 };
//log.info(b_object);
//log.info(b_object, "b_object");
//log.info({ b_object });
//log.info({ b_object }, "b_object");
//log.info("b_object=%o", b_object);
//console.log("b_object=%o", b_object);


log.debug("test-pino:-");

