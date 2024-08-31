const pino = require('pino');

// Define a custom default serializer
const defaultSerializer = (obj) => {
  console.log("defaultSerializer:+");
  if (typeof obj !== 'object' || obj === null) {
    console.log("defaultSerializer:- non-object");
    return obj; // Return non-object values as-is
  }

  const firstLevelProperties = {};
  countProps = 0;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      countProps += 1;
      firstLevelProperties[key] = typeof obj[key];
    }
  }
  console.log("defaultSerializer:- countProps=%d", countProps);
  return firstLevelProperties;
};

// Initialize Pino with the default serializer
const log = pino({
  serializers: {
    '*': defaultSerializer // Apply to all objects
  }
});

const mysql = require("mysql2/promise");

// Test the serializer with the mysql object
log.info(mysql, "First-level properties of mysql object");

log.debug("test-pino:-");

