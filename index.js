import fp from 'fastify-plugin';
import Database_inline from 'better-sqlite3';

const _createDbConnection = (Database, options) => {

    //
    // If path to db exists, use that else create a db in memory
    //
    const file = options.pathToDb
        ? options.pathToDb
        : ':memory:';

    const betterSqlite3Opts = options.betterSqlite3Opts || {};
    return new Database(file, betterSqlite3Opts);
}

const fastifyBetterSqlite3 = (fastify, options, next) => {

    let db;

    if (options.class) {
        const Database_imported = options.class;

        //
        // options has a ready made db connection, so use it if it is valid
        //
        if (options.connection) {

            if (options.connection instanceof Database_imported) {
                db = options.connection;
            }

        }
        else {
            db = _createDbConnection(Database_imported, options);
        }
    }

    // create a new db connection using the inline Database class and the 
    // options passed in
    else {
        db = _createDbConnection(Database_inline, options)
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