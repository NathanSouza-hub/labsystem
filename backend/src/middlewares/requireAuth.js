const { verifyToken } = require("../utils/jwt");

function requireAuth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "É necessário estar autenticado para acessar este recurso." });
    }

    try {
        req.user = verifyToken(token);
        next();
    } catch (error) {
        return res.status(401).json({ error: "Sessão inválida ou expirada." });
    }
}

module.exports = requireAuth;
