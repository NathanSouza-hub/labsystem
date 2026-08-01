function validateUserUpdate(req, res, next) {
    const { username, password } = req.body;
    const errors = [];

    if (!username || typeof username !== "string" || !username.trim()) {
        errors.push("username é obrigatório e deve ser um texto não vazio.");
    }

    if (password !== undefined && password !== null && password !== "") {
        if (typeof password !== "string" || password.length < 6) {
            errors.push("password deve ter pelo menos 6 caracteres.");
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
}

module.exports = validateUserUpdate;
