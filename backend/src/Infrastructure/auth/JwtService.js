const jwt = require("jsonwebtoken");
 
class JwtService {
    generarToken(payload){
        return jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );
    }

    verificarToken(token){
        return jwt.verify(
            token,
            process.env.JWT_SECRET
        );
    }
}
module.exports = JwtService;

