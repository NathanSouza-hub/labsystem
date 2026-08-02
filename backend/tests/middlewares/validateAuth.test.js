const validateAuth = require("../../src/middlewares/validateAuth");

function criarResposta() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("validateAuth", () => {
    it("chama next() com username e password válidos", () => {
        const req = { body: { username: "joao", password: "senha123" } };
        const res = criarResposta();
        const next = jest.fn();

        validateAuth(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it("rejeita username vazio", () => {
        const req = { body: { username: "   ", password: "senha123" } };
        const res = criarResposta();
        const next = jest.fn();

        validateAuth(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("rejeita password com menos de 6 caracteres", () => {
        const req = { body: { username: "joao", password: "123" } };
        const res = criarResposta();
        const next = jest.fn();

        validateAuth(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.json.mock.calls[0][0].errors).toEqual(
            expect.arrayContaining([expect.stringContaining("password")])
        );
    });

    it("rejeita quando username ou password não são enviados", () => {
        const res = criarResposta();
        const next = jest.fn();

        validateAuth({ body: {} }, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.json.mock.calls[0][0].errors).toHaveLength(2);
    });
});
