"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = require("dotenv");
const error_1 = require("./middlewares/error");
const cors_1 = require("./utils/cors");
// import { limiter } from "./utils/rate-limit";
const user_1 = __importDefault(require("./routes/user"));
const supplier_1 = __importDefault(require("./routes/supplier"));
const product_1 = __importDefault(require("./routes/product"));
const order_1 = __importDefault(require("./routes/order"));
const cart_1 = __importDefault(require("./routes/cart"));
const error_2 = __importDefault(require("./routes/error"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const url = process.env.BASE_URL;
const PORT = process.env.PORT;
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cors_1.corsMiddleware);
app.use("/api/v1/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
// app.use(limiter);
app.use("/api/v1", user_1.default);
app.use("/api/v1", supplier_1.default);
app.use("/api/v1", product_1.default);
app.use("/api/v1", order_1.default);
app.use("/api/v1", cart_1.default);
app.use("*catchall", error_2.default);
app.use(error_1.errorHandler);
app.listen(PORT, () => console.log(`
    ░█████╗░██╗░░██╗
    ██╔══██╗██║░██╔╝
    ██║░░██║█████═╝░
    ██║░░██║██╔═██╗░
    ╚█████╔╝██║░╚██╗
    ░╚════╝░╚═╝░░╚═╝
    
    𝗟𝗼𝗰𝗮𝗹: ${url}
    `));
