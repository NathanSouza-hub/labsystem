const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

// aceita tanto "localhost" quanto "127.0.0.1" na mesma porta do FRONTEND_URL,
// já que o navegador trata as duas como origens diferentes
const ALLOWED_ORIGINS = [
    ...new Set([
        process.env.FRONTEND_URL,
        process.env.FRONTEND_URL.replace("localhost", "127.0.0.1"),
        process.env.FRONTEND_URL.replace("127.0.0.1", "localhost")
    ])
];

app.use(cors({
    origin: ALLOWED_ORIGINS,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(routes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
