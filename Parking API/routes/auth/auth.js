const db = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
    app.post("/login", (req, res) => {
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
        if (errors.length !== 0) { res.json({ errors: errors }); return; }

        db.get("select password from users where email = ?", req.body.email, (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            if (row === undefined) {
                res.status(404).json({ error: "User Not Found" })
            }
            // console.log(row);
            if (bcrypt.compareSync(req.body.password, row.password))
                res.json({ status: "success", token: jwt.sign({ email: req.body.email }, process.env.SECRET_KEY) })
        })
    })
    app.post("/register", (req, res) => {
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

        if (errors.length !== 0) { res.json({ errors: errors }); return; }

        // create(res, req.body.email, req.body.first_name, req.body.last_name, req.body.password);
        console.log("pass");
        db.run('INSERT INTO users (first_name, last_name, email, password) VALUES (?,?,?,?)',
            [req.body.first_name, req.body.last_name, req.body.email, bcrypt.hashSync(req.body.password, 10)],
            function (err) {
                if (err) {
                    if (err.code === "SQLITE_CONSTRAINT") {
                        res.json({
                            error: "Email already exist"
                        });
                        return;
                    }
                    res.status(400).json({ "error": err.message })
                    return;
                }
                res.status(201).json({
                    "status": "success",
                    "token": jwt.sign({ email: req.body.email }, process.env.SECRET_KEY),
                })
            });
    })
}