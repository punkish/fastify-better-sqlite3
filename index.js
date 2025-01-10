import fp from 'fastify-plugin';
import Database from 'better-sqlite3';

function createDbConnection(dbClass, options) {

    // If path to db exists, use that, else create a db in memory
    //
    const file = options.pathToDb
        ? options.pathToDb
        : ':memory:';

    const betterSqlite3Opts = options.betterSqlite3Opts || {};
    return new dbClass(file, betterSqlite3Opts);
}

function fastifyBetterSqlite3(fastify, options, next) {

    let db;

    if (options.class) {
        const dbClass = options.class;

        // options has a ready made db connection, so use it if it is valid
        //
        if (options.connection) {

            if (options.connection instanceof dbClass) {
                db = options.connection;
            }

        }
        else {
            db = createDbConnection(dbClass, options);
        }
    }

    // create a new db connection using the inline Database class and the 
    // options passed in
    //
    else {
        db = createDbConnection(Database, options)
    }
    
    if (fastify.betterSqlite3) {
        next(new Error('plugin already registered'));
    }
    
    fastify.decorate('betterSqlite3', db);
    fastify.addHook('onClose', (fastify, done) => db.close(done));

    next();
}

export default fp(fastifyBetterSqlite3, {
    fastify: '5.x',
    name: 'fastify-better-sqlite3'
})