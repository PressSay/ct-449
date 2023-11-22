import express from "express";
import cors from "cors";
import ApiError from "./app/api-error.js";
import loginRouter from "./app/routes/login.route.js";
import accountsRouter from "./app/routes/account.route.js";
import cartsRouter from "./app/routes/cart.route.js";
import categoriesRouter from "./app/routes/category.route.js";
import productsRouter from "./app/routes/product.route.js";
import recipesRouter from "./app/routes/recipe.route.js";
import reviewsRouter from "./app/routes/review.route.js";
import morgan from 'morgan';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.static('public'))

app.use("/api/auth", loginRouter)
app.use("/api/accounts", accountsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/recipes", recipesRouter);
app.use("/api/reviews", reviewsRouter);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to cook application." });
});

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error"
    });
});

export default app;