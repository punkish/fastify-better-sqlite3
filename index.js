import fp from 'fastify-plugin';
import Database from 'better-sqlite3';

const fastifyBetterSqlite3 = (fastify, options, next) => {
    const file = options.path || ':memory';
    const betterSqlite3Opts = options.betterSqlite3options || {};

    const db = new Database(file, betterSqlite3Opts);

    if (!fastify.betterSqlite3) {
        next(new Error('plugin already registered'))
    }
    
    fastify.decorate('betterSqlite3', db.conn);
    fastify.addHook('onClose', (fastify, done) => db.conn.close(done));

    next();
}

export default fp(fastifyBetterSqlite3, {
    fastify: '4.x',
    name: 'fastify-better-sqlite3'
})