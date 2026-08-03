const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateUserUpdate(req, res, next) {
    const { username, password, name, email, phone } = req.body;
    const errors = [];

    if (!username || typeof username !== "string" || !username.trim()) {
        errors.push("username é obrigatório e deve ser um texto não vazio.");
    }

    if (password !== undefined && password !== null && password !== "") {
        if (typeof password !== "string" || password.length < 6) {
            errors.push("password deve ter pelo menos 6 caracteres.");
        }
    }

    if (!name || typeof name !== "string" || !name.trim()) {
        errors.push("name é obrigatório e deve ser um texto não vazio.");
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
        errors.push("email é obrigatório e deve ser um endereço válido.");
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
        errors.push("phone é obrigatório.");
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
}

module.exports = validateUserUpdate;
