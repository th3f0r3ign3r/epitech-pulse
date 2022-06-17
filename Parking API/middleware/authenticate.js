const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized, Invalid Token" });
            }
            req.user = user["id"];
            next();
        });
    } else {
        res.status(403).json({ message: "Access Forbidden" })
    }
}