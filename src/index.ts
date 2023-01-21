import express, { Express, Request, Response } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieparser from "cookie-parser";
import { connectDatabase } from "./database";
import dotenv from "dotenv";
// import { signDatabaseOpsToken } from "./helpers/jwtTokens";

import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";
import { webhooksRouter } from "./routes/webhooks";
import { itemsRouter } from "./routes/items";
import { cartRouter } from "./routes/cart";
import { paymentRouter } from "./routes/payment";
import { orderRouter } from "./routes/order";
import { locationRouter } from "./routes/location";
import { operatorRouter } from "./routes/operator";
import { storageRouter } from "./routes/storage";

// dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Connect to database
connectDatabase();

// Middlewares
/// Cors
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.4:3000",
  "https://www.gastromia.com",
  "https://gastromia.com",
  "https://www.hub.gastromia.com",
  "https://hub.gastromia.com",
];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(options));

/// Cookie parser
app.use(cookieparser());

/// Json
app.use(express.json({ limit: "2mb" }));

// Auth routes
app.use("/auth", authRouter);

// User routes
app.use("/user", userRouter);

// Items routes
app.use("/items", itemsRouter);

// Cart routes
app.use("/cart", cartRouter);

// Payment routes
app.use("/payment", paymentRouter);

// Order routes
app.use("/order", orderRouter);

// Location routes
app.use("/location", locationRouter);

// Operator routes
app.use("/operator", operatorRouter);

// Storage routes
app.use("/storage", storageRouter);

// Whatsapp
app.use("/webhooks", webhooksRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
