const db = require('../../config/db')

exports.getBookings = (res) => {
    db.all("select * from bookings", [], (err, rows) => {
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
    db.get("select * from bookings where id = ?", [id], (err, row) => {
        if (err) {
            res.status(400).json({
                error: err.message
            })
            return;
        }
        if (row === undefined) {
            res.status(404).json({
                error: "Booking not found"
            })
            return;
        }
        res.json({
            status: "success",
            data: row
        })
    })
}

exports.destroy = (res, id) => {
    db.run(
        'DELETE FROM bookings WHERE id = ?', id,
        function (err) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({ "message": "deleted", changes: this.changes })
        });
}

exports.store = (res, user_id, parking_id, end, start) => {
    db.get("select count() as count from bookings where parking_id = ?", [parking_id], (err, row) => {
        if (err) {
            console.log(err);
            res.status(400).json({
                error: err.message
            })
            return;
        }
        const count = row.count
        console.log(count);
        db.get("select lots from parkings where id = ?", [parking_id], (err, row) => {
            if (err) {
                res.json({
                    error: err.message
                })
                return;
            }
            const lots = row.lots
            // console.log(lots);
            if (count < lots) {
                db.run("insert into bookings (user_id, parking_id, start, end) values (?,?,?,?)",
                    [user_id, parking_id, start, end], (err) => {
                        if (err) {
                            res.status(400).json({
                                error: err.message
                            })
                            return;
                        }
                        // console.log(this)
                        res.status(201).json({
                            status: "success",
                            id: this.lastID
                        })

                    })
            } else {
                res.status(507).json({
                    status: "failed", message: "Full to capacity"
                })
            }
        })
    })
}