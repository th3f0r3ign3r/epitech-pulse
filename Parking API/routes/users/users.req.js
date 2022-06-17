const db = require("../../config/db")
const bcrypt = require("bcrypt")

exports.findAllUsers = (res) => {
    db.all("select * from users", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "status": "success",
            "rows": rows.length,
            "data": rows
        })
    })
}

exports.findById = (id, res) => {
    db.get("select * from users where id = ?", [id], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (row === undefined) {
            res.status(404).json({ error: "User Not Found" })
        }
        res.json({
            "status": "success",
            "data": row
        })
    });
}


exports.create = (res, email, first_name, last_name, password) => {
    db.run('INSERT INTO users (first_name, last_name, email, password) VALUES (?,?,?,?)',
        [first_name, last_name, email, bcrypt.hashSync(password, 10)],
        function (err) {
            if (err) {
                if (err.code === "SQLITE_CONSTRAINT")
                    res.json({
                        error: "Email already exist"
                    })
                res.status(400).json({ "error": err.message })
                return;
            }
            res.status(201).json({
                "status": "success",
                "id": this.lastID,
            })
        });
}

exports.update = (res, id, email, first_name, last_name, password) => {
    db.get("select password from users where id = ?", [id], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (row === undefined) {
            res.status(404).json({ error: "User Not Found" })
        } else {
            if (bcrypt.compareSync(password, row.password)) {
                console.log(true)
                db.run(`UPDATE users set first_name = ?, last_name = ?, email = ? WHERE id = ?`,
                    [first_name, last_name, email, id],
                    function (err) {
                        console.log(err)
                        if (err && err.code === "SQLITE_CONSTRAINT")
                            res.status(400).json({ "error": "Email already exist" })
                        else res.json({
                            message: "success",
                            changes: this.changes
                        })
                    })
            } else {
                res.status(401).json({
                    status: 401,
                    message: "Unauthorized"
                })
            }
        }
    });
}

exports.destroy = (res, id) => {
    db.run(
        'DELETE FROM users WHERE id = ?',
        id,
        function (err) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({ "message": "deleted", changes: this.changes })
        });
}