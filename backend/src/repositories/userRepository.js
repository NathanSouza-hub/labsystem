const connection = require("../database/connection");

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
        (username, password_hash)
        VALUES (?, ?)
    `;

    connection.query(sql, [user.username, user.password_hash], callback);
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

    sql += " ORDER BY username ASC";

    connection.query(sql, params, callback);
}

// Buscar por ID (sem expor password_hash)
function getUserById(id, callback) {
    const sql = "SELECT id, username, created_at FROM users WHERE id = ?";

    connection.query(sql, [id], (error, results) => {
        if (error) return callback(error);

        callback(null, results[0]);
    });
}

module.exports = {
    getUserByUsername,
    createUser,
    getAllUsers,
    getUserById
};
