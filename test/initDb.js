import Database from "better-sqlite3";

export const initDb = () => {
    const db = new Database('./test/db.sqlite');

    let stm = 'CREATE TABLE IF NOT EXISTS t (id INTEGER PRIMARY KEY, txt TEXT)';
    db.prepare(stm).run();

    stm = 'SELECT Count(*) AS num FROM t';
    const { num } = db.prepare(stm).get();

    if (!num) {
        stm = db.prepare('INSERT INTO t (txt) VALUES (?)');

        for (let i = 0; i < 100; i++) {
            stm.run(Math.random().toString(36).slice(2))
        }
    }
    
    return {
        "class": Database,
        "connection": db
    }
}
