const express = require("express");
const cors = require("cors");
const session = require("express-session");
const routes = require("./routes");
const authRoutes = require("./routes/authRoutes");
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

app.use(notFound);
app.use(errorHandler);

module.exports = app;
