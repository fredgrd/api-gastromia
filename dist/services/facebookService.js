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
const whatsapp_json_1 = __importDefault(require("../data/whatsapp.json"));
var WhatsappMessage;
(function (WhatsappMessage) {
    WhatsappMessage[WhatsappMessage["Intro"] = 0] = "Intro";
    WhatsappMessage[WhatsappMessage["More"] = 1] = "More";
    WhatsappMessage[WhatsappMessage["Poke"] = 2] = "Poke";
    WhatsappMessage[WhatsappMessage["PokeDIY"] = 3] = "PokeDIY";
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
                    payload = {
                        messaging_product: "whatsapp",
                        recipient_type: "individual",
                        type: "interactive",
                        interactive: {
                            type: "button",
                            header: {
                                type: "text",
                                text: "Ecco i nostri poke:",
                            },
                            body: {
                                text: "Salmon Basic 🐟\n_Riso sushi, salmone, avocado, pomodorini, edamame, verza viola, semi di sesamo, salsa ponzu lime_\n\nTuna Picante 🌶\n_Riso basmati, tonno, jalapeño, alga wakame, mandorle tostate, avocado, zenzero marinato, spicy mayo_\n\nVegan Queen 🌱\n_Quinoa, ceci, pomodorini, spinacino, patate dolci al forno, noci, guacamole, citronette_\n\nShrimp Pimp 🦐\n_Riso sushi, gamber alla griglia, lime squeeze, barbabietola, cetriolo, mango, edamame, salsa teriyaki_",
                            },
                            footer: {
                                text: "Per ordinare scrivi: ordine [orario] [nome] [piatti]",
                            },
                            action: {
                                buttons: [
                                    {
                                        type: "reply",
                                        reply: {
                                            id: "REPLY_BUTTON_POKE_MAKE_YOUR_OWN",
                                            title: "Poke🥙Fai-da-te",
                                        },
                                    },
                                ],
                            },
                        },
                    };
                    break;
                case WhatsappMessage.PokeDIY:
                    payload = whatsapp_json_1.default.poke_diy_payload;
                    break;
            }
            payload = {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                type: "interactive",
                interactive: {
                    type: "button",
                    header: {
                        type: "text",
                        text: "Ecco i nostri poke:",
                    },
                    body: {
                        text: "Salmon Basic 🐟\n_Riso sushi, salmone, avocado, pomodorini, edamame, verza viola, semi di sesamo, salsa ponzu lime_\n\nTuna Picante 🌶\n_Riso basmati, tonno, jalapeño, alga wakame, mandorle tostate, avocado, zenzero marinato, spicy mayo_\n\nVegan Queen 🌱\n_Quinoa, ceci, pomodorini, spinacino, patate dolci al forno, noci, guacamole, citronette_\n\nShrimp Pimp 🦐\n_Riso sushi, gamber alla griglia, lime squeeze, barbabietola, cetriolo, mango, edamame, salsa teriyaki_",
                    },
                    footer: {
                        text: "Per ordinare scrivi: ordine [orario] [nome] [piatti]",
                    },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: {
                                    id: "REPLY_BUTTON_POKE_MAKE_YOUR_OWN",
                                    title: "Poke🥙Fai-da-te",
                                },
                            },
                        ],
                    },
                },
            };
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
    acceptOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add from message
            console.log("ACCEPT ORDER", this.acceptOrderPhoneNumber, this.apiVersion);
            try {
                const response = yield axios_1.default.post(`https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`, {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: this.acceptOrderPhoneNumber,
                    type: "text",
                    text: {
                        // the text object
                        preview_url: false,
                        body: order,
                    },
                }, {
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
}
exports.FacebookService = FacebookService;
