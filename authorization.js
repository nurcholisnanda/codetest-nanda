const jwt = require("jsonwebtoken");

module.exports = () => {
    return (req, res, next) => {
        const token = req.headers("authorization");
        if(!token) {
            return res.status(401).send("access denied");
        } else {
            const tokenBody = token.slice(7);

            jwt.verify(tokenBody, "secret key", (err, decoded) => {
                if(err) {
                    return res.status(401).send("Error: Access Denied");
                }
                next();
            })
        }
    }
}