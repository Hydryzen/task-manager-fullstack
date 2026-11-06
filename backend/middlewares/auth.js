const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });

    try {
        const verificado = jwt.verify(token, JWT_SECRET);
        req.usuario = verificado; 
        next(); 
    } catch (error) {
        res.status(400).json({ error: 'Token inválido o expirado' });
    }
};

module.exports = verificarToken;