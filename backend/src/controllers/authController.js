const authService = require("../services/authService");

// Cadastrar usuário
function register(req, res) {
    authService.register(req.body, (error) => {
        if (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ error: "Usuário ou e-mail já cadastrado." });
            }

            return res.status(500).json({ error: "Erro ao cadastrar usuário." });
        }

        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    });
}

// Login
function login(req, res) {
    const { username, password } = req.body;

    authService.login(username, password, (error, user) => {
        if (error) {
            return res.status(500).json({ error: "Erro ao autenticar." });
        }

        if (!user) {
            return res.status(401).json({ error: "Usuário ou senha inválidos." });
        }

        req.session.userId = user.id;
        req.session.username = user.username;

        res.json({ message: "Login realizado com sucesso!", username: user.username });
    });
}

// Logout
function logout(req, res) {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({ error: "Erro ao encerrar sessão." });
        }

        res.clearCookie("connect.sid");
        res.json({ message: "Logout realizado com sucesso!" });
    });
}

// Sessão atual
function me(req, res) {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Não autenticado." });
    }

    res.json({ username: req.session.username });
}

module.exports = {
    register,
    login,
    logout,
    me
};
