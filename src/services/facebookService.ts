import axios from "axios";
import { LoggerService } from "./loggerService";
import whatsappPayloads from "../data/whatsapp.json";

export enum WhatsappMessage {
  Intro,
  More,
  Poke,
  PokeDIY,
  Burrito,
  Salad,
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
        payload = whatsappPayloads.poke_payload;
        break;
      case WhatsappMessage.PokeDIY:
        payload = whatsappPayloads.poke_diy_payload;
        break;
      case WhatsappMessage.Burrito:
        payload = whatsappPayloads.burrito_payload;
        break;
      case WhatsappMessage.Salad:
        payload = whatsappPayloads.salad_payload;
        break;
    }

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
