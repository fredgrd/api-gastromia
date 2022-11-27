import express, { Express, Request, Response } from "express";
import { connectDatabase } from "./database";
import dotenv from "dotenv";

import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";
import { webhooksRouter } from "./routes/webhooks";

// dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

// Connect to database
connectDatabase();

// Middlewares
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
