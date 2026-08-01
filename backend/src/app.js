const express = require("express");
const cors = require("cors");
const session = require("express-session");
const routes = require("./routes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2 // 2 horas
    }
}));

app.use(routes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
