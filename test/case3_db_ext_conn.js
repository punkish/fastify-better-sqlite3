import Fastify from 'fastify';
import fastifyBetterSqlite3 from '../index.js';
import { initDb } from './initDb.js';

const fastifyOpts = {
    logger: true
};

try {
    const fastify = Fastify(fastifyOpts);

    //
    // provide an externally created db connection
    //
    const db = initDb();

    //
    // register the plugin – with path to db
    //
    const fastifyBetterSqlite3Opts = {

        //
        // This is the Database class imported via `initDb()` above
        //
        "class": db.class,

        //
        // This is the database connection imported via `initDb()` above
        //
        "connection": db.connection,

        //
        // the following option is not required because a readymade connection
        // is provided above
        //
        // "pathToDb": './path/to/db',

        //
        // betterSqlite3Opts not provided, so default better-sqlite3 options 
        // will be used. See documentation for better-sqlite3
        //
        // "betterSqlite3Opts": { … }
    };

    fastify.register(fastifyBetterSqlite3, fastifyBetterSqlite3Opts);

    //
    // declare a route that gets data from the db
    //
    fastify.get('/', function (request, reply) {
        const { num } = fastify.betterSqlite3
            .prepare(`SELECT Count(*) AS num FROM t`)
            .get();

        const rows = fastify.betterSqlite3
            .prepare('SELECT * FROM t LIMIT 10')
            .all();

        reply.send({
            message: 'case 3: these results from db file created by an external connection',
            'count of rows': num,
            rows
        });
    })

    await fastify.listen({ port: 3010 });
}
catch (err) {
    console.log(err);
    process.exit(1);
}