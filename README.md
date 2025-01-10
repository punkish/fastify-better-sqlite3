# fastify-better-sqlite3

Fastify plugin using `better-sqlite3` to connect to a sqlite database.

## Install

```js
npm install @punkish/fastify-better-sqlite3
```

## Compatibility

Plugin version: ^2.0.0  
Fastify version: ^5.2.1

## Usage

There are three ways to use the plug-in, and each one is described below in entirety.

## Case 1: db in memory

A db in memory is created using `better-sqlite3` default options

```js
import Fastify from 'fastify';
import fastifyBetterSqlite3 from './plugins/lib/better-sqlite3.js';
import Database from 'better-sqlite3';

// fastify options, see fastify documentation
//
const fastifyOpts = { … };

try {
    const fastify = Fastify(fastifyOpts);

    // provide an empty options object
    //
    const fastifyBetterSqlite3Opts = {};

    // register the plugin
    //
    fastify.register(fastifyBetterSqlite3, fastifyBetterSqlite3Opts);

    // use the plugin
    //
    fastify.get('/', function (request, reply) {
        const { dt } = fastify.betterSqlite3
            .prepare(`SELECT Strftime('%d/%m/%Y %H:%M:%S') AS dt`)
            .get();

        const { version } = fastify.betterSqlite3
            .prepare('SELECT sqlite_version() AS version')
            .get();

        reply.send({
            'current date': dt,
            'sqlite version': version
        });
    });

    await fastify.listen({ port: 3010 });
}
catch (err) {
    console.log(err);
    process.exit(1);
}
```

## Case 2: in-line db

A db is created in the same file as the plugin

```js
import Fastify from 'fastify';
import fastifyBetterSqlite3 from './plugins/lib/better-sqlite3.js';
import Database from 'better-sqlite3';

// fastify options, see fastify documentation
//
const fastifyOpts = { … };

try {
    const fastify = Fastify(fastifyOpts);

    // provide fastifyBetterSqlite3Opts
    //
    const fastifyBetterSqlite3Opts = {

        // The Database class imported above
        //
        "class": Database,

        // if db file doesn't exist, it will be created unless
        // `betterSqlite3options.fileMustExist: true`
        //
        "pathToDb": '/path/to/db.sqlite',

        // The following options are passed on to `better-sqlite3`.
        // The default values are shown below, and none are required.
        // Check better-sqlite3 documentation for details.
        //
        // betterSqlite3options: {
        //     readonly: false,
        //     fileMustExist: false,
        //     timeout: 5000,
        //     verbose: null
        // }
    };

    // register the plugin
    //
    fastify.register(fastifyBetterSqlite3, fastifyBetterSqlite3Opts);

    // use the plugin as above
    //
    
}
catch (err) {
    console.log(err);
    process.exit(1);
}
```

## Case 3: db connection in an external file

A db is created in an external file and passed on to the plugin

```js
import Fastify from 'fastify';
import fastifyBetterSqlite3 from './plugins/lib/better-sqlite3.js';
import { initDb } from 'path/to/initDb.js';

// fastify options, see fastify documentation
//
const fastifyOpts = { … };

try {
    const fastify = Fastify(fastifyOpts);

    const db = initDb();

    // provide fastifyBetterSqlite3Opts
    //
    const fastifyBetterSqlite3Opts = {

        // The Database class imported from the db objected created by initDb()
        //
        "class": db.class,

        // db connection
        "connection": db.connection
    };

    // register the plugin
    //
    fastify.register(fastifyBetterSqlite3, fastifyBetterSqlite3Opts);

    // use the plugin as above
    //
    
}
catch (err) {
    console.log(err);
    process.exit(1);
}
```

All three cases described above can be tested by running each of the provided test scripts as shown below and then testing the plugin from the browser at `http://localhost:3010`

```
$ node test/case1_db_memory.js
…
$ node test/case2_db_inline_conn.js
…
$ node test/case3_db_ext_conn.js
```
