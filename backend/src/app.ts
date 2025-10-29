import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { errorHandler } from "./middlewares/error";
import { corsMiddleware } from "./utils/cors";
// import { limiter } from "./utils/rate-limit";
import user from "./routes/user";
import product from "./routes/product";
import order from "./routes/cart";
import error from "./routes/error";

config();

const app = express();
const url = process.env.BASE_URL;
const PORT = new URL(url as string).port;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));

// app.use(limiter);
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", order);
app.use("*catchall", error);
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`
    ░█████╗░██╗░░██╗
    ██╔══██╗██║░██╔╝
    ██║░░██║█████═╝░
    ██║░░██║██╔═██╗░
    ╚█████╔╝██║░╚██╗
    ░╚════╝░╚═╝░░╚═╝
    
    𝗟𝗼𝗰𝗮𝗹: ${url}
    `)
);
