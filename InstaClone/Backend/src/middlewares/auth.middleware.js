const jwt = require("jsonwebtoken")

function authMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(400).json({ message: "Token not found, Unauthorized access" })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded   // user info store

        next()

    } catch (error) {

        return res.status(401).json({ message: "Invalid token, Unauthorized access" })

    }

}

module.exports = authMiddleware