import Fastify from 'fastify';
import fastifyBetterSqlite3 from '../index.js';
//import { initDb } from './initDb.js';

const fastifyOpts = {
    logger: true
};

try {
    const fastify = Fastify(fastifyOpts);

    //
    // register the plugin with no options – the db is created in memory
    //
    const opts = {};
    fastify.register(fastifyBetterSqlite3, opts);

    //
    // declare a route that gets data from the db
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
    })

    await fastify.listen({ port: 3010 });
}
catch (err) {
    console.log(err);
    process.exit(1);
}