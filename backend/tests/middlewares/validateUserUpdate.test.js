const validateUserUpdate = require("../../src/middlewares/validateUserUpdate");

function criarResposta() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("validateUserUpdate", () => {
    it("chama next() quando username é enviado sem password (senha opcional)", () => {
        const req = { body: { username: "joao" } };
        const res = criarResposta();
        const next = jest.fn();

        validateUserUpdate(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it("chama next() quando password é enviado vazio (mantém a senha atual)", () => {
        const req = { body: { username: "joao", password: "" } };
        const res = criarResposta();
        const next = jest.fn();

        validateUserUpdate(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it("rejeita username vazio", () => {
        const req = { body: { username: "" } };
        const res = criarResposta();
        const next = jest.fn();

        validateUserUpdate(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("rejeita password com menos de 6 caracteres quando enviado", () => {
        const req = { body: { username: "joao", password: "123" } };
        const res = criarResposta();
        const next = jest.fn();

        validateUserUpdate(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.json.mock.calls[0][0].errors).toEqual(
            expect.arrayContaining([expect.stringContaining("password")])
        );
    });
});
