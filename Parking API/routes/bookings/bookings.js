const { getBookings, findById, destroy, store } = require("./booking.req")

module.exports = (app) => {
    app.get("/api/bookings", (req, res) => {
        getBookings(res)
    })
    app.post("/api/bookings", (req, res) => {
        const errors = []
        if (typeof req.body.user_id !== "number" && typeof req.body.parking_id !== "number") 
            errors.push("Incorrect user's or parking's id")
        if (!(new Date(req.body.start) instanceof Date) && !(new Date(req.body.end) instanceof Date)) 
            errors.push("Invalid date make sure to respect this format >>> Apr 19 2010 10:54 <<<")
        store(res, req.body.user_id, req.body.parking_id, req.body.end, req.body.start)
    })
    app.patch("/api/booking/:id", (req, res) => {})
    app.get("/api/booking/:id", (req, res) => {
        findById(res, req.params.id)
    })
    app.delete("/api/booking/:id", (req, res) => {
        destroy(res, req.params.id)
    })
}