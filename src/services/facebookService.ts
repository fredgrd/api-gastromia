import axios from "axios";
import { LoggerService } from "./loggerService";
import whatsappPayloads from "../data/whatsapp.json";

export enum WhatsappMessage {
  Intro,
  More,
  Poke,
  PokeDIY,
}

export class FacebookService {
  readonly token: string;
  readonly apiVersion: string;
  readonly phoneNumberId: string;
  readonly acceptOrderPhoneNumber: string;
  readonly whatsappPayloads: any;

  constructor() {
    this.token = "Bearer " + process.env.FACEBOOK_AUTH_TOKEN;
    this.apiVersion = process.env.FACEBOOK_API_VERSION || "";
    this.phoneNumberId = process.env.FACEBOOK_PHONE_NUMBER_ID || "";
    this.acceptOrderPhoneNumber =
      process.env.WHATSAPP_ACCEPT_ORDER_PHONE_NUMBER || "";
  }

  async sendMessage(message: WhatsappMessage, to: string) {
    let payload: any;
    switch (message) {
      case WhatsappMessage.Intro:
        payload = whatsappPayloads.intro_payload;
        break;
      case WhatsappMessage.More:
        payload = whatsappPayloads.more_payload;
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
        payload = whatsappPayloads.poke_diy_payload;
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
      await axios.post(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`,
        { to: to, ...payload },
        {
          headers: {
            Authorization: this.token,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async acceptOrder(order: string) {
    // Add from message
    console.log("ACCEPT ORDER", this.acceptOrderPhoneNumber, this.apiVersion);
    try {
      const response = await axios.post(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: this.acceptOrderPhoneNumber,
          type: "text",
          text: {
            // the text object
            preview_url: false,
            body: order,
          },
        },
        {
          headers: {
            Authorization: this.token,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
}
