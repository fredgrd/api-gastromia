import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import { connectDatabase } from "./database";
import dotenv from "dotenv";

import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";
import { webhooksRouter } from "./routes/webhooks";

// dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Connect to database
connectDatabase();

// Middlewares
/// Cors
const allowedOrigins = ["http://localhost:3000", "http://192.168.1.9:3000", "https://www.gastromia.com"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

/// Cookie parser
app.use(cookieparser());

/// Json
app.use(express.json());

// Auth routes
app.use("/auth", authRouter);

// User routes
app.use("/user", userRouter);

// Whatsapp
app.use("/webhooks", webhooksRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
