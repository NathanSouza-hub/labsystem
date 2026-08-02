const productService = require("../services/productService");

// Listar todos
function getProducts(req, res) {
    const { q, sort, order, minPrice, maxPrice } = req.query;

    productService.listProducts({ q, sort, order, minPrice, maxPrice }, (error, products) => {
        if (error) {
            return res.status(500).json({
                error: "Erro ao buscar produtos."
            });
        }

        res.json(products);
    });
}

// Buscar por ID
function getProductById(req, res) {
    const { id } = req.params;

    productService.getProduct(id, (error, product) => {
        if (error) {
            return res.status(500).json({
                error: "Erro ao buscar produto."
            });
        }

        if (!product) {
            return res.status(404).json({
                error: "Produto não encontrado."
            });
        }

        res.json(product);
    });
}

// Cadastrar
function createProduct(req, res) {
    const product = {
        ...req.body,
        created_by: req.session.username
    };

    productService.createProduct(product, (error, result) => {
        if (error) {
            return res.status(500).json({
                error: "Erro ao cadastrar produto."
            });
        }

        res.status(201).json({
            message: "Produto cadastrado com sucesso!"
        });
    });
}

// Atualizar
function updateProduct(req, res) {
    const { id } = req.params;

    productService.updateProduct(id, req.body, (error) => {
        if (error) {
            return res.status(500).json({
                error: "Erro ao atualizar produto."
            });
        }

        res.json({
            message: "Produto atualizado com sucesso!"
        });
    });
}

// Excluir
function deleteProduct(req, res) {
    const { id } = req.params;

    productService.deleteProduct(id, (error) => {
        if (error) {
            return res.status(500).json({
                error: "Erro ao excluir produto."
            });
        }

        res.json({
            message: "Produto excluído com sucesso!"
        });
    });
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
