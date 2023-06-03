import fp from 'fastify-plugin';
import Database from 'better-sqlite3';

const fastifyBetterSqlite3 = (fastify, options, next) => {

    let db;

    // options is a ready made db connection, so use it
    if (options instanceof Database) {
        db = options;
    }

    // create a new db connection using the options passed in
    else {

        // default db in memory
        let file = ':memory:';

        // if path to db exists, use that instead of memory
        if (options.path) {
            file = options.path;
        }

        // use the passed in options or the default better-sqlite3 values
        const betterSqlite3Opts = options.betterSqlite3options || {};
        db = new Database(file, betterSqlite3Opts);
    }
    
    if (fastify.betterSqlite3) {
        next(new Error('plugin already registered'));
    }
    
    fastify.decorate('betterSqlite3', db);
    fastify.addHook('onClose', (fastify, done) => db.close(done));

    next();
}

export default fp(fastifyBetterSqlite3, {
    fastify: '4.x',
    name: 'fastify-better-sqlite3'
})