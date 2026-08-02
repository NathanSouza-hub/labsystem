jest.mock("../../src/database/connection", () => ({
    query: jest.fn()
}));

const connection = require("../../src/database/connection");
const productRepository = require("../../src/repositories/productRepository");

describe("productRepository.getAllProducts", () => {
    beforeEach(() => {
        connection.query.mockReset();
        connection.query.mockImplementation((sql, params, callback) => callback(null, []));
    });

    it("monta um SELECT simples quando não há filtros", () => {
        productRepository.getAllProducts({}, () => {});

        const [sql, params] = connection.query.mock.calls[0];
        expect(sql).toBe("SELECT * FROM products");
        expect(params).toEqual([]);
    });

    it("busca por descrição, usuário e id quando 'q' é numérico", () => {
        productRepository.getAllProducts({ q: "42" }, () => {});

        const [sql, params] = connection.query.mock.calls[0];
        expect(sql).toContain("WHERE (description LIKE ? OR created_by LIKE ? OR id = ?)");
        expect(params).toEqual(["%42%", "%42%", 42]);
    });

    it("não inclui a condição de id quando 'q' não é numérico", () => {
        productRepository.getAllProducts({ q: "mouse" }, () => {});

        const [sql, params] = connection.query.mock.calls[0];
        expect(sql).toContain("WHERE (description LIKE ? OR created_by LIKE ?)");
        expect(sql).not.toContain("id = ?");
        expect(params).toEqual(["%mouse%", "%mouse%"]);
    });

    it("filtra por categoria", () => {
        productRepository.getAllProducts({ category: "Hardware" }, () => {});

        const [sql, params] = connection.query.mock.calls[0];
        expect(sql).toContain("WHERE category = ?");
        expect(params).toEqual(["Hardware"]);
    });

    it("combina busca por texto e categoria com AND", () => {
        productRepository.getAllProducts({ q: "mouse", category: "Periféricos" }, () => {});

        const [sql, params] = connection.query.mock.calls[0];
        expect(sql).toContain("WHERE (description LIKE ? OR created_by LIKE ?) AND category = ?");
        expect(params).toEqual(["%mouse%", "%mouse%", "Periféricos"]);
    });

    it("ignora colunas de ordenação fora da whitelist (protege contra SQL injection)", () => {
        productRepository.getAllProducts({ sort: "id; DROP TABLE products;--", order: "asc" }, () => {});

        const [sql] = connection.query.mock.calls[0];
        expect(sql).not.toContain("ORDER BY");
    });

    it("aplica ORDER BY quando a coluna de ordenação é válida", () => {
        productRepository.getAllProducts({ sort: "price", order: "desc" }, () => {});

        const [sql] = connection.query.mock.calls[0];
        expect(sql).toContain("ORDER BY price DESC");
    });

    it("usa ASC como padrão quando 'order' não é 'desc'", () => {
        productRepository.getAllProducts({ sort: "price" }, () => {});

        const [sql] = connection.query.mock.calls[0];
        expect(sql).toContain("ORDER BY price ASC");
    });

    it("repassa erro do banco para o callback", () => {
        const erroFalso = new Error("falha de conexão");
        connection.query.mockImplementation((sql, params, callback) => callback(erroFalso));

        const callback = jest.fn();
        productRepository.getAllProducts({}, callback);

        expect(callback).toHaveBeenCalledWith(erroFalso);
    });
});

describe("productRepository.createProduct", () => {
    beforeEach(() => {
        connection.query.mockReset();
    });

    it("insere todas as colunas na ordem esperada", () => {
        connection.query.mockImplementation((sql, params, callback) => callback(null, { insertId: 1 }));

        const callback = jest.fn();
        productRepository.createProduct(
            { description: "Mouse", quantity: 5, price: 50, category: "Periféricos", created_by: "admin" },
            callback
        );

        const [sql, params] = connection.query.mock.calls[0];
        expect(sql).toContain("INSERT INTO products");
        expect(params).toEqual(["Mouse", 5, 50, "Periféricos", "admin"]);
    });
});

describe("productRepository.updateProduct", () => {
    beforeEach(() => {
        connection.query.mockReset();
    });

    it("atualiza os campos editáveis sem alterar created_by", () => {
        connection.query.mockImplementation((sql, params, callback) => callback(null, { affectedRows: 1 }));

        const callback = jest.fn();
        productRepository.updateProduct(
            7,
            { description: "Mouse novo", quantity: 3, price: 60, category: "Outros" },
            callback
        );

        const [sql, params] = connection.query.mock.calls[0];
        expect(sql).not.toContain("created_by");
        expect(params).toEqual(["Mouse novo", 3, 60, "Outros", 7]);
    });
});
