"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const database_1 = require("./database");
const dotenv_1 = __importDefault(require("dotenv"));
// import { signDatabaseOpsToken } from "./helpers/jwtTokens";
const auth_1 = require("./routes/auth");
const user_1 = require("./routes/user");
const webhooks_1 = require("./routes/webhooks");
const items_1 = require("./routes/items");
const cart_1 = require("./routes/cart");
const payment_1 = require("./routes/payment");
const order_1 = require("./routes/order");
const location_1 = require("./routes/location");
const operator_1 = require("./routes/operator");
const storage_1 = require("./routes/storage");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Connect to database
(0, database_1.connectDatabase)();
// Middlewares
/// Cors
const allowedOrigins = [
    "https://www.gastromia.com",
    "https://gastromia.com",
    "https://www.hub.gastromia.com",
    "https://hub.gastromia.com",
];
const options = {
    origin: allowedOrigins,
    credentials: true,
};
app.use((0, cors_1.default)(options));
/// Cookie parser
app.use((0, cookie_parser_1.default)());
/// Json
app.use(express_1.default.json({ limit: "2mb" }));
// Auth routes
app.use("/auth", auth_1.authRouter);
// User routes
app.use("/user", user_1.userRouter);
// Items routes
app.use("/items", items_1.itemsRouter);
// Cart routes
app.use("/cart", cart_1.cartRouter);
// Payment routes
app.use("/payment", payment_1.paymentRouter);
// Order routes
app.use("/order", order_1.orderRouter);
// Location routes
app.use("/location", location_1.locationRouter);
// Operator routes
app.use("/operator", operator_1.operatorRouter);
// Storage routes
app.use("/storage", storage_1.storageRouter);
// Whatsapp
app.use("/webhooks", webhooks_1.webhooksRouter);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
