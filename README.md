# Experiment pino

Experiment with pino logging

I've created issue 2037 [Simpler default logging output for objects](https://github.com/pinojs/pino/issues/2037).

If you wish to "run" code in this project clone the repo and run
`npm install` to install the dependencies.

Pino looks good. I like its focus on performance
and low overhead, see GPT4o
[Efficient Logging with Pino](https://chatgpt.com/share/29d9e0fd-4180-40c3-b907-d95a48df8514).
But I've run into one problem, logging arbitrary objects is
very very verbose,
see [GPT4o Reducing Pino Verbosity](https://chatgpt.com/share/f82a79cb-8ca8-4def-812f-73522e62412b).
As you can see below console.log output 636 characters
and pino log.info output 10,020 characters:
```bash
wink@3900x 24-08-31T18:12:36.649Z:~/prgs/javascript/pino-logging
$ cat -n test-object-logging.js 
     1  const pino = require('pino');
     2
     3  const log = pino();
     4
     5  const mysql = require("mysql2/promise");
     6  console.log("mysql=%s", mysql);
     7  //log.info(mysql, "mysql");
     8
wink@3900x 24-08-31T18:12:48.875Z:~/prgs/javascript/pino-logging
$ node test-object-logging.js | wc -c
636
wink@3900x 24-08-31T18:13:02.376Z:~/prgs/javascript/pino-logging
$ vi test-object-logging.js 
wink@3900x 24-08-31T18:13:19.886Z:~/prgs/javascript/pino-logging
$ cat -n test-object-logging.js 
     1  const pino = require('pino');
     2
     3  const log = pino();
     4
     5  const mysql = require("mysql2/promise");
     6  //console.log("mysql=%s", mysql);
     7  log.info(mysql, "mysql");
     8
wink@3900x 24-08-31T18:13:28.338Z:~/prgs/javascript/pino-logging
$ node test-object-logging.js | wc -c
10020
wink@3900x 24-08-31T18:13:33.383Z:~/prgs/javascript/pino-logging
$ 
```

The solutions GPT40 suggested are:

* Just print pieces of the object of interest:
```javascript
wink@3900x 24-08-31T18:16:42.429Z:~/prgs/javascript/pino-logging (main)
$ cat -n test-pieces.js 
     1  const pino = require('pino');
     2
     3  const log = pino();
     4
     5  const mysql = require("mysql2/promise");
     6
     7  log.info({
     8    createConnection: typeof mysql.createConnection,
     9    createPool: typeof mysql.createPool,
    10    escape: typeof mysql.escape
    11  }, "mysql");
    12
    13  log.debug("test-pino:-");
wink@3900x 24-08-31T18:22:27.860Z:~/prgs/javascript/pino-logging (main)
$ node test-pieces.js 
{"level":30,"time":1725128556798,"pid":822547,"hostname":"3900x","createConnection":"function","createPool":"function","escape":"function","msg":"mysql"}
wink@3900x 24-08-31T18:22:36.809Z:~/prgs/javascript/pino-logging (main)
```

* Use a custom serializer:
```javascript
wink@3900x 24-08-31T18:22:36.809Z:~/prgs/javascript/pino-logging (main)
$ cat -n test-custom-serializer.js 
     1  const pino = require('pino');
     2
     3  const log = pino({
     4    serializers: {
     5      mysql: (mysql) => ({
     6        createConnection: typeof mysql.createConnection,
     7        createPool: typeof mysql.createPool,
     8        escape: typeof mysql.escape,
     9        // Add other properties you need here
    10      })
    11    }
    12  });
    13
    14  const mysql = require("mysql2/promise");
    15
    16  log.info({ mysql }, "mysql");
    17  log.debug("test-pino:-");
    18
wink@3900x 24-08-31T18:23:31.396Z:~/prgs/javascript/pino-logging (main)
$ node test-custom-serializer.js 
{"level":30,"time":1725128627377,"pid":823070,"hostname":"3900x","mysql":{"createConnection":"function","createPool":"function","escape":"function"},"msg":"mysql"}
wink@3900x 24-08-31T18:23:47.389Z:~/prgs/javascript/pino-logging (main)
```

Those both work but I wondered if there might be a generic solution that
has results similar to the console.log output and wondered if there was
a way to print just the "first level" of an object. GPT4o suggested that
could bed done and it works great, the output is basically the same as
console.log and nearly identical when pino-pretty is used:
```javascript
wink@3900x 24-08-31T18:27:36.003Z:~/prgs/javascript/pino-logging (main)
$ cat -n test-first-level-properties.js 
     1  const pino = require('pino');
     2  const log = pino();
     3
     4  const mysql = require("mysql2/promise");
     5
     6  // Iterate over the first-level properties of the mysql object
     7  const firstLevelProperties = {};
     8  for (const key in mysql) {
     9    if (mysql.hasOwnProperty(key)) {
    10      firstLevelProperties[key] = typeof mysql[key];
    11    }
    12  }
    13
    14  console.log("First-level properties:", firstLevelProperties);
    15  log.info(firstLevelProperties, "First-level properties of mysql object");
    16
    17  log.debug("test-pino:-");
    18
wink@3900x 24-08-31T18:27:46.862Z:~/prgs/javascript/pino-logging (main)
$ node test-first-level-properties.js | pino-pretty 
First-level properties: {
  createConnection: 'function',
  createPool: 'function',
  createPoolCluster: 'function',
  escape: 'function',
  escapeId: 'function',
  format: 'function',
  raw: 'function',
  PromisePool: 'function',
  PromiseConnection: 'function',
  PromisePoolConnection: 'function',
  Types: 'object',
  Charsets: 'object',
  CharsetToEncoding: 'object',
  setMaxParserCache: 'function',
  clearParserCache: 'function'
}
[11:28:00.850] INFO (824725): First-level properties of mysql object
    createConnection: "function"
    createPool: "function"
    createPoolCluster: "function"
    escape: "function"
    escapeId: "function"
    format: "function"
    raw: "function"
    PromisePool: "function"
    PromiseConnection: "function"
    PromisePoolConnection: "function"
    Types: "object"
    Charsets: "object"
    CharsetToEncoding: "object"
    setMaxParserCache: "function"
    clearParserCache: "function"
wink@3900x 24-08-31T18:28:00.867Z:~/prgs/javascript/pino-logging (main)
```

I then prompted GPT4o with "Printing the first level printed the same info as console.log. Is there a way to generalize this by adding a default serializer that pino would use for objects that don't have a custom serializer."
```javascript
$ cat -n test-default-firstlevel-serializer.js 
     1  const pino = require('pino');
     2
     3  // Define a custom default serializer
     4  const defaultSerializer = (obj) => {
     5    console.log("defaultSerializer:+");
     6    if (typeof obj !== 'object' || obj === null) {
     7      console.log("defaultSerializer:- non-object");
     8      return obj; // Return non-object values as-is
     9    }
    10
    11    const firstLevelProperties = {};
    12    countProps = 0;
    13    for (const key in obj) {
    14      if (obj.hasOwnProperty(key)) {
    15        countProps += 1;
    16        firstLevelProperties[key] = typeof obj[key];
    17      }
    18    }
    19    console.log("defaultSerializer:- countProps=%d", countProps);
    20    return firstLevelProperties;
    21  };
    22
    23  // Initialize Pino with the default serializer
    24  const log = pino({
    25    serializers: {
    26      '*': defaultSerializer // Apply to all objects
    27    }
    28  });
    29
    30  const mysql = require("mysql2/promise");
    31
    32  // Test the serializer with the mysql object
    33  log.info(mysql, "First-level properties of mysql object");
    34
    35  log.debug("test-pino:-");
    36
wink@3900x 24-08-31T18:34:03.013Z:~/prgs/javascript/pino-logging (main)
$ node test-default-firstlevel-serializer.js | wc -c
10053
wink@3900x 24-08-31T18:34:37.667Z:~/prgs/javascript/pino-logging (main)
```

But that didn't work and it appears defaultSerializer was never called.
It suggested some solutions which you can see at the bottom of the conversation,
but I didn't like them, but we'll see.

## License

Licensed under either of

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or http://apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall
be dual licensed as above, without any additional terms or conditions.

