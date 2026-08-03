const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");

const SALT_ROUNDS = 10;

// Listar todos
function listUsers(filters, callback) {
    userRepository.getAllUsers(filters, callback);
}

// Buscar por ID
function getUser(id, callback) {
    userRepository.getUserById(id, callback);
}

// Contar
function countUsers(callback) {
    userRepository.countUsers(callback);
}

// Atualizar (senha só é alterada se enviada)
function updateUser(id, data, callback) {
    userRepository.updateProfile(id, data, (error) => {
        if (error) return callback(error);

        if (!data.password) {
            return callback(null);
        }

        bcrypt.hash(data.password, SALT_ROUNDS, (error, hash) => {
            if (error) return callback(error);

            userRepository.updatePasswordHash(id, hash, callback);
        });
    });
}

// Excluir
function deleteUser(id, callback) {
    userRepository.deleteUser(id, callback);
}

module.exports = {
    listUsers,
    getUser,
    countUsers,
    updateUser,
    deleteUser
};
