import axios from 'axios';
import { randomAlphanumeric } from '../helpers/alphanumericGenerator';
import whatsappPayloads from '../data/whatsapp.json';

export enum WhatsappMessage {
  Intro,
  More,
  Poke,
  PokeDIY,
  Burrito,
  Salad,
  Pita,
  Drinks,
}

export class FacebookService {
  readonly token: string;
  readonly apiVersion: string;
  readonly phoneNumberId: string;
  readonly acceptOrderPhoneNumber: string;
  readonly whatsappPayloads: any;

  constructor() {
    this.token = 'Bearer ' + process.env.FACEBOOK_AUTH_TOKEN;
    this.apiVersion = process.env.FACEBOOK_API_VERSION || '';
    this.phoneNumberId = process.env.FACEBOOK_PHONE_NUMBER_ID || '';
    this.acceptOrderPhoneNumber =
      process.env.WHATSAPP_ACCEPT_ORDER_PHONE_NUMBER || '';
  }

  async sendUpdate(update: string, to: string, orderCode: string) {
    let template = '';
    if (update === 'accepted') {
      template = 'order_accept';
    } else if (update === 'rejected') {
      template = 'order_rejected';
    } else if (update === 'ready') {
      template = 'order_ready';
    } else if (update === 'completed') {
      template = 'order_completed';
    }

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'template',
      template: {
        name: template,
        language: {
          code: 'it',
        },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'text',
                text: orderCode,
              },
            ],
          },
        ],
      },
    };

    try {
      await axios.post(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`,
        payload,
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
      case WhatsappMessage.Pita:
        payload = whatsappPayloads.pita_payload;
        break;
      case WhatsappMessage.Drinks:
        payload = whatsappPayloads.drinks_payload;
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

  async acceptOrder(order: string, from: string) {
    const orderCode = randomAlphanumeric(4);

    try {
      const response = await axios.post(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: this.acceptOrderPhoneNumber,
          type: 'text',
          text: {
            preview_url: false,
            body: `ORDER: *${orderCode}*\n\nFROM: +${from}\n\n${order}`,
          },
        },
        {
          headers: {
            Authorization: this.token,
          },
        }
      );

      if (response.status === 200) {
        await axios.post(
          `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`,
          {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: from,
            type: 'text',
            text: {
              preview_url: false,
              body: `Ordine accettato 🎉\n\nIl tuo codice di riferimento: *${orderCode}*\n\n_In caso di problemi contatta il numero +39 333 789 0510_`,
            },
          },
          {
            headers: {
              Authorization: this.token,
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}
