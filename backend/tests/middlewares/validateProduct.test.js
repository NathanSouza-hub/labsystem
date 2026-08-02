const validateProduct = require("../../src/middlewares/validateProduct");

function criarResposta() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("validateProduct", () => {
    it("chama next() quando todos os campos são válidos", () => {
        const req = { body: { description: "Mouse", quantity: 10, price: 50, category: "Periféricos" } };
        const res = criarResposta();
        const next = jest.fn();

        validateProduct(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("rejeita quando description está vazia ou só com espaços", () => {
        const req = { body: { description: "   ", quantity: 10, price: 50, category: "Outros" } };
        const res = criarResposta();
        const next = jest.fn();

        validateProduct(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json.mock.calls[0][0].errors).toEqual(
            expect.arrayContaining([expect.stringContaining("description")])
        );
    });

    it("rejeita quantity negativa ou não inteira", () => {
        const base = { description: "Item", price: 10, category: "Outros" };

        const resNegativa = criarResposta();
        validateProduct({ body: { ...base, quantity: -1 } }, resNegativa, jest.fn());
        expect(resNegativa.status).toHaveBeenCalledWith(400);

        const resDecimal = criarResposta();
        validateProduct({ body: { ...base, quantity: 1.5 } }, resDecimal, jest.fn());
        expect(resDecimal.status).toHaveBeenCalledWith(400);
    });

    it("rejeita price zero, negativo ou não numérico", () => {
        const base = { description: "Item", quantity: 1, category: "Outros" };

        const resZero = criarResposta();
        validateProduct({ body: { ...base, price: 0 } }, resZero, jest.fn());
        expect(resZero.status).toHaveBeenCalledWith(400);

        const resTexto = criarResposta();
        validateProduct({ body: { ...base, price: "50" } }, resTexto, jest.fn());
        expect(resTexto.status).toHaveBeenCalledWith(400);
    });

    it("rejeita categoria fora da lista de opções válidas", () => {
        const req = { body: { description: "Item", quantity: 1, price: 10, category: "Categoria Inventada" } };
        const res = criarResposta();
        const next = jest.fn();

        validateProduct(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.json.mock.calls[0][0].errors).toEqual(
            expect.arrayContaining([expect.stringContaining("category")])
        );
    });

    it("aceita todas as categorias válidas da lista", () => {
        const categorias = ["Hardware", "Periféricos", "Componentes", "Armazenamento", "Redes", "Informática", "Outros"];

        categorias.forEach((category) => {
            const req = { body: { description: "Item", quantity: 1, price: 10, category } };
            const res = criarResposta();
            const next = jest.fn();

            validateProduct(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });
    });

    it("acumula todos os erros de uma vez quando o corpo vem vazio", () => {
        const req = { body: {} };
        const res = criarResposta();
        const next = jest.fn();

        validateProduct(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.json.mock.calls[0][0].errors).toHaveLength(4);
    });
});
