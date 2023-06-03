import Fastify from 'fastify';
import fastifyBetterSqlite3 from '../index.js';

const fastifyOpts = {
    logger: true
};

try {
    const fastify = Fastify(fastifyOpts);

    //
    // register the plugin – with path to db
    //
    const opts = {
        path: './test/db.sqlite'
    }

    fastify.register(fastifyBetterSqlite3, opts);

    //
    // declare a route that gets data from the db
    //
    fastify.get('/', function (request, reply) {
        const res = fastify.betterSqlite3
            .prepare(`SELECT * FROM pragma_table_list() WHERE name = 't'`)
            .get();

        const rows = fastify.betterSqlite3
            .prepare(`SELECT * FROM t`)
            .all();

        res.rows = rows;
        reply.send(res);
    })

    await fastify.listen({ port: 3010 });
}
catch (err) {
    console.log(err);
    process.exit(1);
}