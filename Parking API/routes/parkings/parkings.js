const authenticate = require("../../middleware/authenticate")
const { store, findAllParkings, findById, update, destroy } = require("./parkings.req")

module.exports = (app) => {
    app.get("/api/parkings", authenticate, (req, res) => {
        findAllParkings(res)
    })
    app.post("/api/parkings", authenticate, (req, res) => {
        const errors = [];

        if (req.body.title.length < 5 || typeof req.body.title !== "string")
            errors.push('Title are required and must be at least 5 characters');
        if (req.body.description.length < 5 || typeof req.body.description !== "string")
            errors.push('Description are required and must be at least 5 characters');
        if (req.body.location.length < 5 || typeof req.body.location !== "string")
            errors.push('Location are required and must be at least 5 characters');
        if (typeof parseInt(req.body.lots) !== "number" || parseInt(req.body.lots) < 0) 
            errors.push("Lots must be a number or more than 0")
        if (typeof parseInt(req.body.price) !== "number" || parseInt(req.body.price) < 0) 
            errors.push("Price must be a number or more than 0")

        if (errors.length !== 0) res.json({ errors: errors })
        store(res, req.body.title, req.body.description, parseInt(req.body.lots), parseInt(req.body.price), req.body.location)
    })
    app.get("/api/parking/:id", authenticate, (req, res) => {
        findById(res, req.params.id)
    })
    app.patch("/api/parking/:id", authenticate, (req, res) => {
        const errors = [];

        if (req.body.title.length < 5 && typeof req.body.title !== "string")
            errors.push('Title are required and must be at least 5 characters');
        if (req.body.description.length < 5 && typeof req.body.description !== "string")
            errors.push('Description are required and must be at least 5 characters');
        if (req.body.location.length < 5 && typeof req.body.location !== "string")
            errors.push('Location are required and must be at least 5 characters');
        if (typeof parseInt(req.body.lots) !== "number" || parseInt(req.body.lots) < 0)
            errors.push("Lots must be a number or more than 0")

        if (errors.length !== 0) res.json({ errors: errors })
        update(res, req.params.id, req.body.title, req.body.description, req.body.location, req.body.lots)
    })
    app.delete("/api/parking/:id", authenticate, (req, res) => {
        destroy(res, req.params.id)
    })
}