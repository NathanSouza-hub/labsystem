const productRepository = require("../repositories/productRepository");

// Listar todos
function listProducts(filters, callback) {
    productRepository.getAllProducts(filters, callback);
}

// Buscar por ID
function getProduct(id, callback) {
    productRepository.getProductById(id, callback);
}

// Cadastrar
function createProduct(product, callback) {
    productRepository.createProduct(product, callback);
}

// Atualizar
function updateProduct(id, product, callback) {
    productRepository.updateProduct(id, product, callback);
}

// Excluir
function deleteProduct(id, callback) {
    productRepository.deleteProduct(id, callback);
}

module.exports = {
    listProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};