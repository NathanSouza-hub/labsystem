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

module.exports = {
    getUserByUsername,
    createUser
};
