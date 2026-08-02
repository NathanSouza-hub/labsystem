const validateRegister = require("../../src/middlewares/validateRegister");

function criarResposta() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

function corpoValido(sobrescreve = {}) {
    return {
        username: "joao",
        password: "senha123",
        name: "João Silva",
        email: "joao@teste.com",
        phone: "11999999999",
        ...sobrescreve
    };
}

describe("validateRegister", () => {
    it("chama next() quando todos os campos são válidos", () => {
        const res = criarResposta();
        const next = jest.fn();

        validateRegister({ body: corpoValido() }, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it("rejeita quando name está vazio", () => {
        const res = criarResposta();
        const next = jest.fn();

        validateRegister({ body: corpoValido({ name: "" }) }, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.json.mock.calls[0][0].errors).toEqual(
            expect.arrayContaining([expect.stringContaining("name")])
        );
    });

    it.each(["semarroba.com", "faltaarroba@", "@semusuario.com", "espaco @teste.com"])(
        "rejeita e-mail em formato inválido: %s",
        (emailInvalido) => {
            const res = criarResposta();
            const next = jest.fn();

            validateRegister({ body: corpoValido({ email: emailInvalido }) }, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.json.mock.calls[0][0].errors).toEqual(
                expect.arrayContaining([expect.stringContaining("email")])
            );
        }
    );

    it("aceita e-mail em formato válido", () => {
        const res = criarResposta();
        const next = jest.fn();

        validateRegister({ body: corpoValido({ email: "usuario@dominio.com.br" }) }, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it("rejeita quando phone está vazio", () => {
        const res = criarResposta();
        const next = jest.fn();

        validateRegister({ body: corpoValido({ phone: "" }) }, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.json.mock.calls[0][0].errors).toEqual(
            expect.arrayContaining([expect.stringContaining("phone")])
        );
    });
});
