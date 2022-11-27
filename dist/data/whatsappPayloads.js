"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.introPayload = void 0;
exports.introPayload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    type: "interactive",
    interactive: {
        type: "button",
        header: {
            type: "text",
            text: "Ciao! Benvenuto su Gastromia😋",
        },
        body: {
            text: "Ecco cosa c'è nel menù di oggi:\n\n- Poke 🥙\n-Salads 🥗\n- Pita 🫔\n- Burrito 🌯\n\nClicca sui bottoni quì sotto per scoprire i nostri piatti 👇\n\nPer ordinare...",
        },
        action: {
            buttons: [
                {
                    type: "reply",
                    reply: {
                        id: "REPLY_BUTTON_POKE",
                        title: "Poke 🍲",
                    },
                },
                {
                    type: "reply",
                    reply: {
                        id: "REPLY_BUTTON_BURRITO",
                        title: "Burrito 🌯",
                    },
                },
            ],
        },
    },
};
