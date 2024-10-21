const jwt = require('jsonwebtoken');

const authAdminMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não encontrado.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if (verified.funcao !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado. Função inadequada.' });
        }
        
        req.user = verified;

        next();
    } catch (error) {
        res.status(400).json({ error: 'Token inválido.' });
    }
};

module.exports = authAdminMiddleware;
