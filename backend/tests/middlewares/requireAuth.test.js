jest.mock("../../src/utils/jwt");

const { verifyToken } = require("../../src/utils/jwt");
const requireAuth = require("../../src/middlewares/requireAuth");

function criarResposta() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("requireAuth", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("bloqueia com 401 quando não há cookie de token", () => {
        const req = { cookies: {} };
        const res = criarResposta();
        const next = jest.fn();

        requireAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
        expect(verifyToken).not.toHaveBeenCalled();
    });

    it("popula req.user e chama next() quando o token é válido", () => {
        verifyToken.mockReturnValue({ id: 1, username: "admin" });
        const req = { cookies: { token: "token-valido" } };
        const res = criarResposta();
        const next = jest.fn();

        requireAuth(req, res, next);

        expect(verifyToken).toHaveBeenCalledWith("token-valido");
        expect(req.user).toEqual({ id: 1, username: "admin" });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("bloqueia com 401 quando o token é inválido ou expirado", () => {
        verifyToken.mockImplementation(() => {
            throw new Error("jwt expired");
        });
        const req = { cookies: { token: "token-invalido" } };
        const res = criarResposta();
        const next = jest.fn();

        requireAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Sessão inválida ou expirada." });
        expect(next).not.toHaveBeenCalled();
    });
});
