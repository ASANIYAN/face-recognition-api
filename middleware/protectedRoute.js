const protectedRoute = (req, res, next) => {
    const jwt = require("jsonwebtoken");
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({message: "token not found"});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token"});
        req.user = {email: user.email};
        next();
    })
}

module.exports = {
    protectedRoute
}