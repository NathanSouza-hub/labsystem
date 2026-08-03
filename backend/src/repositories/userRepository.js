const connection = require("../database/connection");

const SORTABLE_COLUMNS = ["id", "username", "created_at"];

// Buscar por username
function getUserByUsername(username, callback) {
    const sql = "SELECT * FROM users WHERE username = ?";

    connection.query(sql, [username], (error, results) => {
        if (error) return callback(error);

        callback(null, results[0]);
    });
}

// Inserir
function createUser(user, callback) {
    const sql = `
        INSERT INTO users
        (username, password_hash, name, email, phone)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [user.username, user.password_hash, user.name, user.email, user.phone],
        callback
    );
}

// Listar todos (sem expor password_hash), com busca opcional por id/username
function getAllUsers(filters, callback) {
    const params = [];
    let sql = "SELECT id, username, created_at FROM users";

    if (filters.q) {
        const condicoes = ["username LIKE ?"];
        params.push(`%${filters.q}%`);

        const idBuscado = Number(filters.q);
        if (Number.isInteger(idBuscado)) {
            condicoes.push("id = ?");
            params.push(idBuscado);
        }

        sql += ` WHERE (${condicoes.join(" OR ")})`;
    }

    if (SORTABLE_COLUMNS.includes(filters.sort)) {
        const order = filters.order === "desc" ? "DESC" : "ASC";
        sql += ` ORDER BY ${filters.sort} ${order}`;
    } else {
        sql += " ORDER BY username ASC";
    }

    connection.query(sql, params, callback);
}

// Buscar por ID (sem expor password_hash)
function getUserById(id, callback) {
    const sql = "SELECT id, username, name, email, phone, created_at FROM users WHERE id = ?";

    connection.query(sql, [id], (error, results) => {
        if (error) return callback(error);

        callback(null, results[0]);
    });
}

// Contar usuários (usado para impedir excluir o último)
function countUsers(callback) {
    const sql = "SELECT COUNT(*) AS total FROM users";

    connection.query(sql, (error, results) => {
        if (error) return callback(error);

        callback(null, results[0].total);
    });
}

// Atualizar dados do perfil (username, nome, email, telefone)
function updateProfile(id, data, callback) {
    const sql = "UPDATE users SET username = ?, name = ?, email = ?, phone = ? WHERE id = ?";

    connection.query(sql, [data.username, data.name, data.email, data.phone, id], callback);
}

// Atualizar senha
function updatePasswordHash(id, passwordHash, callback) {
    const sql = "UPDATE users SET password_hash = ? WHERE id = ?";

    connection.query(sql, [passwordHash, id], callback);
}

// Excluir
function deleteUser(id, callback) {
    const sql = "DELETE FROM users WHERE id = ?";

    connection.query(sql, [id], callback);
}

module.exports = {
    getUserByUsername,
    createUser,
    getAllUsers,
    getUserById,
    countUsers,
    updateProfile,
    updatePasswordHash,
    deleteUser
};
