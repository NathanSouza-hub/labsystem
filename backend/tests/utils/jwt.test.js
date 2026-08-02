process.env.JWT_SECRET = "segredo-de-teste";

const jsonwebtoken = require("jsonwebtoken");
const { generateToken, verifyToken } = require("../../src/utils/jwt");

describe("utils/jwt", () => {
    it("gera um token que, ao ser verificado, devolve o mesmo payload", () => {
        const token = generateToken({ id: 1, username: "admin" });
        const payload = verifyToken(token);

        expect(payload).toMatchObject({ id: 1, username: "admin" });
        expect(payload.exp).toBeDefined();
    });

    it("rejeita um token corrompido ou mal formado", () => {
        expect(() => verifyToken("isso.nao.e-um-jwt-valido")).toThrow();
    });

    it("rejeita um token assinado com um segredo diferente", () => {
        const tokenForjado = jsonwebtoken.sign({ id: 1 }, "segredo-errado");

        expect(() => verifyToken(tokenForjado)).toThrow();
    });
});
