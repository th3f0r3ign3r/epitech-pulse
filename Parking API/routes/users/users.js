const authenticate = require("../../middleware/authenticate");
const { findAllUsers, findById, create, destroy, update } = require("./users.req");

module.exports = (app) => {
    app.get("/api/users", authenticate, (req, res) => {
        findAllUsers(res);
    });
    app.get("/api/user/:id", authenticate, (req, res) => {
        findById(req.params.id, res);
    });
    app.post("/api/users", authenticate, (req, res) => {
        const errors = [];
        const pwdRg = new RegExp(
            /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/,
        );
        const emailRg = new RegExp(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );

        if (!req.body.password)
            errors.push("No password specified");
        else if (!pwdRg.test(req.body.password))
            errors.push(
                'Invalid password your password must contain at least 1 number, uppercase letter and special chars',
            );
        if (!emailRg.test(req.body.email)) errors.push('Invalid email address');
        if (req.body.first_name.length < 3)
            errors.push('Fist_name are required and must be at least 3 characters');
        if (req.body.last_name.length < 3)
            errors.push('Last_name are required and must be at least 3 characters');

        if (errors.length !== 0) res.json({ errors: errors })
        create(res, req.body.email, req.body.first_name, req.body.last_name, req.body.password);
    });
    app.patch("/api/user/:id", authenticate, (req, res) => {
        const errors = [];
        const pwdRg = new RegExp(
            /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/,
        );
        const emailRg = new RegExp(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );

        if (!req.body.password)
            errors.push("No password specified");
        else if (!pwdRg.test(req.body.password))
            errors.push(
                'Invalid password your password must contain at least 1 number, uppercase letter and special chars',
            );
        if (!emailRg.test(req.body.email)) errors.push('Invalid email address');
        if (req.body.first_name.length < 3)
            errors.push('Fist_name are required and must be at least 3 characters');
        if (req.body.last_name.length < 3)
            errors.push('Last_name are required and must be at least 3 characters');

        if (errors.length !== 0) res.json(checkEmail)
        update(res, req.params.id, req.body.email, req.body.first_name, req.body.last_name, req.body.password);
    });
    app.delete("/api/user/:id", authenticate, (req, res) => {
        destroy(res, req.params.id)
    })
}
