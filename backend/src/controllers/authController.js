const authService = require("../services/authService");
const { generateToken } = require("../utils/jwt");

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 2 // 2 horas
};

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

        const token = generateToken({ id: user.id, username: user.username });
        res.cookie("token", token, COOKIE_OPTIONS);

        res.json({ message: "Login realizado com sucesso!", username: user.username });
    });
}

// Logout
function logout(req, res) {
    res.clearCookie("token", COOKIE_OPTIONS);
    res.json({ message: "Logout realizado com sucesso!" });
}

// Sessão atual
function me(req, res) {
    res.json({ username: req.user.username });
}

module.exports = {
    register,
    login,
    logout,
    me
};
