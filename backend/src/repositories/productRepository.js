const connection = require("../database/connection");

const SORTABLE_COLUMNS = ["id", "created_at", "created_by", "price", "description", "quantity"];

// Listar todos (com busca opcional por id/descrição/usuário, categoria e ordenação opcional)
function getAllProducts(filters, callback) {
    const params = [];
    const condicoesWhere = [];
    let sql = "SELECT * FROM products";

    if (filters.q) {
        const condicoesBusca = ["description LIKE ?", "created_by LIKE ?"];
        params.push(`%${filters.q}%`, `%${filters.q}%`);

        const idBuscado = Number(filters.q);
        if (Number.isInteger(idBuscado)) {
            condicoesBusca.push("id = ?");
            params.push(idBuscado);
        }

        condicoesWhere.push(`(${condicoesBusca.join(" OR ")})`);
    }

    if (filters.category) {
        condicoesWhere.push("category = ?");
        params.push(filters.category);
    }

    if (condicoesWhere.length > 0) {
        sql += ` WHERE ${condicoesWhere.join(" AND ")}`;
    }

    if (SORTABLE_COLUMNS.includes(filters.sort)) {
        const order = filters.order === "desc" ? "DESC" : "ASC";
        sql += ` ORDER BY ${filters.sort} ${order}`;
    }

    connection.query(sql, params, (error, results) => {
        if (error) return callback(error);

        callback(null, results);
    });
}

// Buscar por ID
function getProductById(id, callback) {
    const sql = "SELECT * FROM products WHERE id = ?";

    connection.query(sql, [id], (error, results) => {
        if (error) return callback(error);

        callback(null, results[0]);
    });
}

// Inserir
function createProduct(product, callback) {
    const sql = `
        INSERT INTO products
        (description, quantity, price, category, created_by)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [
            product.description,
            product.quantity,
            product.price,
            product.category,
            product.created_by
        ],
        callback
    );
}

// Atualizar (não altera created_by: preserva quem originalmente cadastrou)
function updateProduct(id, product, callback) {
    const sql = `
        UPDATE products
        SET
            description = ?,
            quantity = ?,
            price = ?,
            category = ?
        WHERE id = ?
    `;

    connection.query(
        sql,
        [
            product.description,
            product.quantity,
            product.price,
            product.category,
            id
        ],
        callback
    );
}

// Excluir
function deleteProduct(id, callback) {
    const sql = "DELETE FROM products WHERE id = ?";

    connection.query(sql, [id], callback);
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
