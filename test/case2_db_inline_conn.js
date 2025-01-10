/*
 * This example demonstrates the use of importing the Database class from
 * better-sqlite3 and fastifyBetterSqlite3 plugin in the same file
 */ 
import Fastify from 'fastify';
import fastifyBetterSqlite3 from '../index.js';
import Database from 'better-sqlite3';

const fastifyOpts = {
    logger: true
};

try {
    const fastify = Fastify(fastifyOpts);

    //
    // register the plugin – with path to db
    //
    const fastifyBetterSqlite3Opts = {

        //
        // This is the Database class imported above
        //
        "class": Database,

        //
        // The following option is not required because a pathToDb is provided
        // below which will be used by the plugin to construct a connection
        //
        // "connection": db.connection,

        "pathToDb": './test/db.sqlite',

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
            message: 'case 2: these results from db file created by connection in the same file as the plugin',
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