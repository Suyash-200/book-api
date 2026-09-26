const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const bearerHeader = req.headers.authorization;

        if (!bearerHeader) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const token = bearerHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);

        req.user = user;

        next();

    } catch (error) {
        return res.status(403).json({
            message: "Invalid token or expired"
        });
    }
};

module.exports = auth;