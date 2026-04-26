import createError from "http-errors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index.js";
import headers from "./middlewares/headers.js";
import authorization from "./middlewares/authorization.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.post('auth/login', (req, res) => {
  res.send('API WORKS');
});

// middlewares
app.use(headers);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use(authorization);

app.use("/", indexRouter);

app.use(notFound);
app.use(errorHandler);
export default app;