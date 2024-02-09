const { verify } = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized'});
    }

    try {
        const decoded = verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token'})
    }
};

module.exports = authenticateUser