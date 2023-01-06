import express, { Express, Request, Response } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieparser from "cookie-parser";
import { connectDatabase } from "./database";
import dotenv from "dotenv";
import { signDatabaseOpsToken } from "./helpers/jwtTokens";

import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";
import { webhooksRouter } from "./routes/webhooks";
import { itemsRouter } from "./routes/items";
import { cartRouter } from "./routes/cart";
import { stripeRouter } from "./routes/stripe";
import { orderRouter } from "./routes/order";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Connect to database
connectDatabase();

// Middlewares
/// Cors
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.9:3000",
  "https://www.gastromia.com",
];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
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

// Items routes
app.use("/items", itemsRouter);

// Cart routes
app.use("/cart", cartRouter);

// Stripe routes
app.use("/stripe", stripeRouter);

// Order routes
app.use("/order", orderRouter);

// Whatsapp
app.use("/webhooks", webhooksRouter);

console.log(
  signDatabaseOpsToken({
    name: "Federico Giordani",
    email: "federico@gastromia.com",
  })
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
