function validateProduct(req, res, next) {
    const { description, quantity, price } = req.body;
    const errors = [];

    if (!description || typeof description !== "string" || !description.trim()) {
        errors.push("description é obrigatória e deve ser um texto não vazio.");
    }

    if (quantity === undefined || quantity === null || !Number.isInteger(quantity) || quantity < 0) {
        errors.push("quantity é obrigatória e deve ser um número inteiro maior ou igual a 0.");
    }

    if (price === undefined || price === null || typeof price !== "number" || price <= 0) {
        errors.push("price é obrigatório e deve ser um número maior que 0.");
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
}

module.exports = validateProduct;
