function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: "É necessário estar autenticado para acessar este recurso." });
    }

    next();
}

module.exports = requireAuth;
