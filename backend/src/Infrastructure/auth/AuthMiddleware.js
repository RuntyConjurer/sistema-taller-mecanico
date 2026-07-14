const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const auth = req.headers.authorization;

    if (!auth) {
        return res.status(401).json({
            mensaje: "Token requerido"
        });
    }

    // Corregido el error de split
    const token = auth.split(" ")[1];

    try {
        req.usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        next();
    } 
    catch {
        return res.status(401).json({
            mensaje: "Token invalido"
        });
    }
}

// Asegúrate de que el nombre aquí sea exactamente igual al de la función de arriba
module.exports = authMiddleware;