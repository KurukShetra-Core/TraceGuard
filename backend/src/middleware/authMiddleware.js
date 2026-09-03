const { logger } = require("../utils/logger");

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            logger.warn({
    msg: "Authentication failed: token missing",
    route: req.originalUrl,
    method: req.method
});

            return res.status(401).json({
                status: "error",
                message: "Authentication token is required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        logger.info({
    msg: "JWT authentication successful",
    userId: decoded.userId,
    email: decoded.email,
    route: req.originalUrl,
    method: req.method
});

        next();
    } catch (error) {

        logger.warn({
    msg: "Authentication failed: invalid or expired token",
    route: req.originalUrl,
    method: req.method
});

        return res.status(401).json({
            status: "error",
            message: "Invalid or expired authentication token"
        });
    }
};

module.exports = authMiddleware;