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

// Atualizar
function updateUser(req, res) {
    const { id } = req.params;

    userService.updateUser(id, req.body, (error) => {
        if (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ error: "Nome de usuário já está em uso." });
            }

            return res.status(500).json({
                error: "Erro ao atualizar usuário."
            });
        }

        res.json({
            message: "Usuário atualizado com sucesso!"
        });
    });
}

// Excluir
function deleteUser(req, res) {
    const { id } = req.params;

    userService.countUsers((error, total) => {
        if (error) {
            return res.status(500).json({
                error: "Erro ao excluir usuário."
            });
        }

        if (total <= 1) {
            return res.status(400).json({
                error: "Não é possível excluir o último usuário do sistema."
            });
        }

        userService.deleteUser(id, (error) => {
            if (error) {
                return res.status(500).json({
                    error: "Erro ao excluir usuário."
                });
            }

            const excluiuAPropriaConta = Number(id) === req.session.userId;

            if (!excluiuAPropriaConta) {
                return res.json({ message: "Usuário excluído com sucesso!" });
            }

            req.session.destroy(() => {
                res.clearCookie("connect.sid");
                res.json({ message: "Usuário excluído com sucesso!", selfDeleted: true });
            });
        });
    });
}

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
