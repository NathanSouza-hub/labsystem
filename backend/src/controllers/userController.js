const userService = require("../services/userService");

// Listar todos
function getUsers(req, res) {
    const { q } = req.query;

    userService.listUsers({ q }, (error, users) => {
        if (error) {
            return res.status(500).json({
                error: "Erro ao buscar usuários."
            });
        }

        res.json(users);
    });
}

// Buscar por ID
function getUserById(req, res) {
    const { id } = req.params;

    userService.getUser(id, (error, user) => {
        if (error) {
            return res.status(500).json({
                error: "Erro ao buscar usuário."
            });
        }

        if (!user) {
            return res.status(404).json({
                error: "Usuário não encontrado."
            });
        }

        res.json(user);
    });
}

module.exports = {
    getUsers,
    getUserById
};
