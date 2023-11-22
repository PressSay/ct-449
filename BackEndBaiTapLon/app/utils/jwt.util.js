import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

class Jwt {
    constructor() {
        dotenv.config();
        process.env.TOKEN_SECRET = "secret";
    }

    generateAccessToken(user) {
        return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
    }

    authenticateToken(req) {
        const authHeader = req.headers['authorization'] ?? "";
        const token = (authHeader != "") ? authHeader && authHeader.split(' ')[1] : null;
        if (token == null) return 401

        let err = false;
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) { console.log(err); err = true; }
            req.user = user;
        });

        return (err) ? 403 : 200;
    }
}

export default Jwt;