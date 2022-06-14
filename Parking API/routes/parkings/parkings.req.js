const db = require("../../config/db")

exports.findAllParkings = (res) => {
    db.all("select * from parkings", [], (err, rows) => {
        if (err) {
            res.status(400).json({
                error: err.message
            })
            return;
        }
        res.json({
            status: "success",
            "rows": rows.length,
            data: rows
        })
    })
}

exports.findById = (res, id) => {
    db.get("select * from parkings where id = ?", [id], (err, row) => {
        if (err) {
            res.status(400).json({
                error: err.message
            })
            return;
        }
        if (row === undefined) {
            res.status(404).json({
                error: "Parking not found"
            })
            return;
        }
        res.json({
            status: "success",
            data: row
        })
    })
}

exports.store = (res, title, description, lots, location) => {
    db.run("insert into parkings (title, description, lots, location, remaining_lots) values (?,?,?,?,?)",
        [title, description, lots, location, lots], (err) => {
            if (err && err.code === "SQLITE_CONSTRAINT") {
                res.json({
                    error: "This location is already used"
                })
            }
            res.status(201).json({
                status: "success",
                id: this.lastID
            })
        }
    )
}

exports.update = (res, id, title, description, location) => {
    db.run(`UPDATE parkings set title = ?, description = ?, location = ? WHERE id = ?`,
        [title, description, location, id],
        function (err) {
            console.log(err)
            if (err && err.code === "SQLITE_CONSTRAINT")
                res.status(400).json({ "error": "This location is already used" })
            else res.json({
                message: "success",
                changes: this.changes
            })
        }
    )
}

exports.destroy = (res, id) => {
    db.run(
        'DELETE FROM parkings WHERE id = ?', id,
        function (err) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({ "message": "deleted", changes: this.changes })
        });
}