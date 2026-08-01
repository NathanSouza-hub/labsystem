const userRepository = require("../repositories/userRepository");

// Listar todos
function listUsers(filters, callback) {
    userRepository.getAllUsers(filters, callback);
}

// Buscar por ID
function getUser(id, callback) {
    userRepository.getUserById(id, callback);
}

module.exports = {
    listUsers,
    getUser
};
