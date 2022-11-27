"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const auth_1 = require("./routes/auth");
const user_1 = require("./routes/user");
const webhooks_1 = require("./routes/webhooks");
// dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
// Connect to database
(0, database_1.connectDatabase)();
// Middlewares
app.use(express_1.default.json());
// Auth routes
app.use("/auth", auth_1.authRouter);
// User routes
app.use("/user", user_1.userRouter);
// Whatsapp
app.use("/webhooks", webhooks_1.webhooksRouter);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
