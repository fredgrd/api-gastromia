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
exports.FacebookService = exports.WhatsappMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const alphanumericGenerator_1 = require("../helpers/alphanumericGenerator");
const whatsapp_json_1 = __importDefault(require("../data/whatsapp.json"));
var WhatsappMessage;
(function (WhatsappMessage) {
    WhatsappMessage[WhatsappMessage["Intro"] = 0] = "Intro";
    WhatsappMessage[WhatsappMessage["More"] = 1] = "More";
    WhatsappMessage[WhatsappMessage["Poke"] = 2] = "Poke";
    WhatsappMessage[WhatsappMessage["PokeDIY"] = 3] = "PokeDIY";
    WhatsappMessage[WhatsappMessage["Burrito"] = 4] = "Burrito";
    WhatsappMessage[WhatsappMessage["Salad"] = 5] = "Salad";
    WhatsappMessage[WhatsappMessage["Pita"] = 6] = "Pita";
    WhatsappMessage[WhatsappMessage["Drinks"] = 7] = "Drinks";
})(WhatsappMessage = exports.WhatsappMessage || (exports.WhatsappMessage = {}));
class FacebookService {
    constructor() {
        this.token = "Bearer " + process.env.FACEBOOK_AUTH_TOKEN;
        this.apiVersion = process.env.FACEBOOK_API_VERSION || "";
        this.phoneNumberId = process.env.FACEBOOK_PHONE_NUMBER_ID || "";
        this.acceptOrderPhoneNumber =
            process.env.WHATSAPP_ACCEPT_ORDER_PHONE_NUMBER || "";
    }
    sendMessage(message, to) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload;
            switch (message) {
                case WhatsappMessage.Intro:
                    payload = whatsapp_json_1.default.intro_payload;
                    break;
                case WhatsappMessage.More:
                    payload = whatsapp_json_1.default.more_payload;
                    break;
                case WhatsappMessage.Poke:
                    payload = whatsapp_json_1.default.poke_payload;
                    break;
                case WhatsappMessage.PokeDIY:
                    payload = whatsapp_json_1.default.poke_diy_payload;
                    break;
                case WhatsappMessage.Burrito:
                    payload = whatsapp_json_1.default.burrito_payload;
                    break;
                case WhatsappMessage.Salad:
                    payload = whatsapp_json_1.default.salad_payload;
                    break;
                case WhatsappMessage.Pita:
                    payload = whatsapp_json_1.default.pita_payload;
                    break;
                case WhatsappMessage.Drinks:
                    payload = whatsapp_json_1.default.drinks_payload;
                    break;
            }
            try {
                yield axios_1.default.post(`https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`, Object.assign({ to: to }, payload), {
                    headers: {
                        Authorization: this.token,
                    },
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    acceptOrder(order, from) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderCode = (0, alphanumericGenerator_1.randomAlphanumeric)(4);
            try {
                const response = yield axios_1.default.post(`https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`, {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: this.acceptOrderPhoneNumber,
                    type: "text",
                    text: {
                        preview_url: false,
                        body: `ORDER: *${orderCode}*\n\nFROM: +${from}\n\n${order}`,
                    },
                }, {
                    headers: {
                        Authorization: this.token,
                    },
                });
                if (response.status === 200) {
                    yield axios_1.default.post(`https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`, {
                        messaging_product: "whatsapp",
                        recipient_type: "individual",
                        to: from,
                        type: "text",
                        text: {
                            preview_url: false,
                            body: `Ordine accettato 🎉\n\nIl tuo codice di riferimento: *${orderCode}*\n\n_In caso di problemi contatta il numero +39 333 789 0510_`,
                        },
                    }, {
                        headers: {
                            Authorization: this.token,
                        },
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.FacebookService = FacebookService;
