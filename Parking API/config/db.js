const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('db.sqlite', (err) => {
    if (err) {
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL)`, (err) => (err) ?? console.log("Table Users created"));
        db.run(`CREATE TABLE parkings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL, 
            price INTEGER NOT NULL,
            lots INTEGER NOT NULL,
            location TEXT UNIQUE NOT NULL)`, (err) => (err) ?? console.log("Table Parkings created"));
        db.run(`CREATE TABLE bookings (
            id INTEGER AUTOICREMENT NOT NULL,
            user_id INTEGER NOT NULL,
            parking_id INTEGER NOT NULL, 
            start DATE NOT NULL, 
            end DATE NOT NULL,
            FOREIGN KEY (user_id) 
                REFERENCES users (id) 
                    ON DELETE CASCADE 
                    ON UPDATE NO ACTION,
            FOREIGN KEY (parking_id) 
                REFERENCES parkings (id) 
                    ON DELETE CASCADE 
                    ON UPDATE NO ACTION)`,
            (err) => (err) ?? console.log("Table Booking created"));
    }
});

module.exports = db