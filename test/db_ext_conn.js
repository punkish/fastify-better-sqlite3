import Fastify from 'fastify';
import fastifyBetterSqlite3 from '../index.js';
import { initDb } from './initDb.js';

const fastifyOpts = {
    logger: true
};

try {
    const fastify = Fastify(fastifyOpts);

    //
    // register the plugin – provide an external db connection
    //
    const opts = initDb();
    fastify.register(fastifyBetterSqlite3, opts);

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