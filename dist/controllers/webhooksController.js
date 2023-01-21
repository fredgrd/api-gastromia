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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWhatsappEvents = exports.verifyWhatsapp = void 0;
const facebookService_1 = require("../services/facebookService");
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
    if (req.body.entry[0] &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].field === "messages" &&
        req.body.entry[0].changes[0].value &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0] &&
        req.body.entry[0].changes[0].value.messages[0].id &&
        (req.body.entry[0].changes[0].value.messages[0].type === "text" ||
            req.body.entry[0].changes[0].value.messages[0].type === "interactive")) {
        const facebookService = new facebookService_1.FacebookService();
        const fromNumber = req.body.entry[0].changes[0].value.messages[0].from;
        const eventId = req.body.entry[0].changes[0].value.messages[0].id;
        let command = "";
        if (req.body.entry[0].changes[0].value.messages[0].type === "text") {
            const text = req.body.entry[0].changes[0].value.messages[0].text.body;
            command = text.split(" ")[0].toLowerCase();
        }
        if (req.body.entry[0].changes[0].value.messages[0].type === "interactive") {
            const replyId = req.body.entry[0].changes[0].value.messages[0].interactive.button_reply
                .id;
            switch (replyId) {
                case "REPLY_BUTTON_POKE":
                    command = "poke";
                    break;
                case "REPLY_BUTTON_POKE_MAKE_YOUR_OWN":
                    command = "pokediy";
                    break;
                case "REPLY_BUTTON_BURRITO":
                    command = "burrito";
                    break;
                case "REPLY_BUTTON_MORE":
                    command = "more";
                    break;
                case "REPLY_BUTTON_SALADS":
                    command = "salad";
                    break;
                case "REPLY_BUTTON_PITA":
                    command = "pita";
                    break;
                case "REPLY_BUTTON_DRINKS":
                    command = "drinks";
                    break;
                default:
                    command = "ciao";
            }
        }
        switch (command) {
            case "ordine":
                yield facebookService.acceptOrder(req.body.entry[0].changes[0].value.messages[0].text.body, fromNumber);
                break;
            case "poke":
                yield facebookService.sendMessage(facebookService_1.WhatsappMessage.Poke, fromNumber);
                break;
            case "pokediy":
                yield facebookService.sendMessage(facebookService_1.WhatsappMessage.PokeDIY, fromNumber);
                break;
            case "burrito":
                yield facebookService.sendMessage(facebookService_1.WhatsappMessage.Burrito, fromNumber);
                break;
            case "more":
                yield facebookService.sendMessage(facebookService_1.WhatsappMessage.More, fromNumber);
                break;
            case "salad":
                yield facebookService.sendMessage(facebookService_1.WhatsappMessage.Salad, fromNumber);
                break;
            case "pita":
                yield facebookService.sendMessage(facebookService_1.WhatsappMessage.Pita, fromNumber);
                break;
            case "drinks":
                yield facebookService.sendMessage(facebookService_1.WhatsappMessage.Drinks, fromNumber);
                break;
            default:
                yield facebookService.sendMessage(facebookService_1.WhatsappMessage.Intro, fromNumber);
        }
    }
    res.status(200).send(process.env.FACEBOOK_ACCESS_TOKEN);
});
exports.handleWhatsappEvents = handleWhatsappEvents;
