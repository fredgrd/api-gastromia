"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWhatsappEvents = exports.verifyWhatsapp = exports.test = void 0;
const axios_1 = __importDefault(require("axios"));
const loggerService_1 = require("../services/loggerService");
const facebookService_1 = require("../services/facebookService");
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post("https://graph.facebook.com/v15.0/100711486214814/messages", {
            messaging_product: "whatsapp",
            to: "393478842092",
            type: "template",
            template: {
                name: "hello_world",
                language: {
                    code: "en_US",
                },
            },
        }, {
            headers: {
                Authorization: "Bearer EAAGliejcNi4BAMlAKATPspUvS8ZChgCg6DLb0uBOYyQQqARcYpOPSqB6ZAScnHMnOMJw4RkLhKwbM5IIadHRgrE0zc7C7K9ZAwmfzZCdWJAkAL26dYUwU6Jt7JPxpKorZCWRMz0ZCNUeAPND3t8ZB136DKBqxq9dycrRDidpyH5qGjqoSKWgB6bMPIfpqYfagup8kZBpaXJ4Ts8CUYEupSuiFcaumXPmdV0ZD",
            },
        });
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
exports.test = test;
const verifyWhatsapp = (req, res) => {
    const challengeCode = req.query["hub.challenge"];
    const tokenToVerify = req.query["hub.verify_token"];
    if (tokenToVerify === process.env.WHATSAPP_VERIFY_TOKEN) {
        res.status(200).send(challengeCode);
    }
    else {
        res.sendStatus(400);
    }
};
exports.verifyWhatsapp = verifyWhatsapp;
const handleWhatsappEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggerService = new loggerService_1.LoggerService();
    yield loggerService.createLog({
        name: "facebookEvent",
        body: `Started`,
    });
    yield loggerService.createLog({
        name: "facebookEvent",
        body: JSON.stringify(req.body),
    });
    console.log(JSON.stringify(req.body));
    if (req.body.entry[0] &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].field === "messages" &&
        req.body.entry[0].changes[0].value &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0] &&
        (req.body.entry[0].changes[0].value.messages[0].type === "text" ||
            req.body.entry[0].changes[0].value.messages[0].type === "interactive")) {
        const facebookService = new facebookService_1.FacebookService();
        const fromNumber = req.body.entry[0].changes[0].value.messages[0].from;
        let command = "";
        if (req.body.entry[0].changes[0].value.messages[0].type === "text") {
            const text = req.body.entry[0].changes[0].value.messages[0].text.body;
            command = text.split(" ")[0].toLowerCase();
        }
        if (req.body.entry[0].changes[0].value.messages[0].type === "interactive") {
            const replyId = req.body.entry[0].changes[0].value.messages[0].interactive.button_reply
                .id;
            console.log("INTERACTIVE", replyId);
            switch (replyId) {
                case "REPLY_BUTTON_POKE":
                    command = "poke";
                    break;
                default:
                    command = "ciao";
            }
            yield loggerService.createLog({
                name: "facebookEvent - interactive",
                body: `${fromNumber} ${command}`,
            });
        }
        yield loggerService.createLog({
            name: "facebookEvent",
            body: `${fromNumber} ${command}`,
        });
        switch (command) {
            case "ordine":
                yield facebookService.acceptOrder(req.body.entry[0].changes[0].value.messages[0].text.body);
                break;
            case "poke":
                yield loggerService.createLog({
                    name: "facebookEvent - sending poke",
                    body: `${fromNumber} ${command}`,
                });
                yield facebookService.sendMessage(facebookService_1.WhatsappMessage.Poke, fromNumber);
                break;
            case "poke🥙fai-da-te":
                yield facebookService.sendMessage(facebookService_1.WhatsappMessage.PokeDIY, fromNumber);
                break;
            case "altro":
                yield facebookService.sendMessage(facebookService_1.WhatsappMessage.More, fromNumber);
                break;
            default:
                yield loggerService.createLog({
                    name: "facebookEvent - sending default",
                    body: `${fromNumber} ${command}`,
                });
                console.log("DEFAULT", command, fromNumber);
                // break;
                yield facebookService.sendMessage(facebookService_1.WhatsappMessage.Intro, fromNumber);
        }
    }
    res.status(200).send(process.env.FACEBOOK_ACCESS_TOKEN);
});
exports.handleWhatsappEvents = handleWhatsappEvents;
