# fastify-better-sqlite3

Fastify plugin using `better-sqlite3` to connect to a sqlite database.

## Install

```js
npm install @punkish/fastify-better-sqlite3
```

## Compatibility

Plugin version: ^1.0.0  
Fastify version: ^4.x.x

## Usage

```js
import Fastify from 'fastify';
import fastifyBetterSqlite3 from './plugins/lib/better-sqlite3.js';

// the following is optional, see `opts3` below for an example
import { initDb } from 'path/to/initDb.js';

// fastify options, see fastify documentation
const fastifyOpts = { … };

try {
    const fastify = Fastify(fastifyOpts);

    // connect three-ways
    //
    // 1. no options provided: a db in memory is created using `better-sqlite3`
    //    default options
    const opts1 = {};

    // 2. provide options as below
    const opts2 = {

        // if db file doesn't exist, it will be created unless
        // `betterSqlite3options.fileMustExist: true`
        path: '/path/to/db.sqlite',

        // The following options are passed on to `better-sqlite3`.
        // The default values are shown below, and none are required.
        // Check better-sqlite3 documentation for details.
        betterSqlite3options: {
            readonly: false,
            fileMustExist: false,
            timeout: 5000,
            verbose: null
        }
    };

    // 3. provide a ready db connection. This may be desirable if custom 
    //    start-up options are required such as creating a specific db and
    //    setting desired pragmas, etc. Below, a function called 
    //    `initDb()` returns a db connection that is passed to the plugin
    const opts3 = initDb();

    //
    // register the plugin
    //
    fastify.register(fastifyBetterSqlite3, opts1);

    //
    // create a route that gets data from the db
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