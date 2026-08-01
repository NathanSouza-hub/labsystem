const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");

const SALT_ROUNDS = 10;

// Cadastrar
function register(user, callback) {
    bcrypt.hash(user.password, SALT_ROUNDS, (error, hash) => {
        if (error) return callback(error);

        userRepository.createUser(
            { username: user.username, password_hash: hash },
            callback
        );
    });
}

// Autenticar
function login(username, password, callback) {
    userRepository.getUserByUsername(username, (error, user) => {
        if (error) return callback(error);
        if (!user) return callback(null, null);

        bcrypt.compare(password, user.password_hash, (error, match) => {
            if (error) return callback(error);
            if (!match) return callback(null, null);

            callback(null, user);
        });
    });
}

module.exports = {
    register,
    login
};
