function notFound(req, res) {
    res.status(404).json({ error: `Rota ${req.method} ${req.originalUrl} não encontrada.` });
}

module.exports = notFound;
