function validateAuth(req, res, next) {
    const { username, password } = req.body;
    const errors = [];

    if (!username || typeof username !== "string" || !username.trim()) {
        errors.push("username é obrigatório e deve ser um texto não vazio.");
    }

    if (!password || typeof password !== "string" || password.length < 6) {
        errors.push("password é obrigatório e deve ter pelo menos 6 caracteres.");
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
}

module.exports = validateAuth;
