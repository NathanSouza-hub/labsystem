jest.mock("bcrypt");
jest.mock("../../src/repositories/userRepository");

const bcrypt = require("bcrypt");
const userRepository = require("../../src/repositories/userRepository");
const authService = require("../../src/services/authService");

beforeEach(() => {
    jest.clearAllMocks();
});

describe("authService.register", () => {
    it("faz o hash da senha antes de salvar e nunca grava a senha em texto puro", (done) => {
        bcrypt.hash.mockImplementation((password, rounds, callback) => callback(null, "hash-fake"));
        userRepository.createUser.mockImplementation((user, callback) => callback(null, { insertId: 1 }));

        authService.register(
            { username: "joao", password: "senha123", name: "João", email: "joao@teste.com", phone: "11999999999" },
            (error) => {
                expect(error).toBeNull();
                expect(bcrypt.hash).toHaveBeenCalledWith("senha123", 10, expect.any(Function));

                const usuarioSalvo = userRepository.createUser.mock.calls[0][0];
                expect(usuarioSalvo.password_hash).toBe("hash-fake");
                expect(usuarioSalvo).not.toHaveProperty("password");
                done();
            }
        );
    });

    it("propaga o erro e não salva nada se o bcrypt falhar", (done) => {
        const erroFalso = new Error("falha no hash");
        bcrypt.hash.mockImplementation((password, rounds, callback) => callback(erroFalso));

        authService.register({ username: "joao", password: "senha123" }, (error) => {
            expect(error).toBe(erroFalso);
            expect(userRepository.createUser).not.toHaveBeenCalled();
            done();
        });
    });
});

describe("authService.login", () => {
    it("retorna null (sem erro) quando o usuário não existe", (done) => {
        userRepository.getUserByUsername.mockImplementation((username, callback) => callback(null, null));

        authService.login("naoexiste", "qualquersenha", (error, user) => {
            expect(error).toBeNull();
            expect(user).toBeNull();
            expect(bcrypt.compare).not.toHaveBeenCalled();
            done();
        });
    });

    it("retorna null quando a senha está incorreta", (done) => {
        userRepository.getUserByUsername.mockImplementation((username, callback) =>
            callback(null, { id: 1, username: "joao", password_hash: "hash-fake" })
        );
        bcrypt.compare.mockImplementation((password, hash, callback) => callback(null, false));

        authService.login("joao", "senhaerrada", (error, user) => {
            expect(error).toBeNull();
            expect(user).toBeNull();
            done();
        });
    });

    it("retorna o usuário quando a senha bate", (done) => {
        const usuarioFalso = { id: 1, username: "joao", password_hash: "hash-fake" };
        userRepository.getUserByUsername.mockImplementation((username, callback) => callback(null, usuarioFalso));
        bcrypt.compare.mockImplementation((password, hash, callback) => callback(null, true));

        authService.login("joao", "senhacorreta", (error, user) => {
            expect(error).toBeNull();
            expect(user).toBe(usuarioFalso);
            done();
        });
    });
});
