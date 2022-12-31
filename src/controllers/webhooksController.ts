import { Request, Response } from "express";
import { LoggerService } from "../services/loggerService";
import { WhatsappMessage, FacebookService } from "../services/facebookService";

export const verifyWhatsapp = (req: Request, res: Response) => {
  const challengeCode = req.query["hub.challenge"];
  const tokenToVerify = req.query["hub.verify_token"];

  if (tokenToVerify === process.env.WHATSAPP_VERIFY_TOKEN) {
    res.status(200).send(challengeCode);
  } else {
    res.sendStatus(400);
  }
};

export const handleWhatsappEvents = async (req: Request, res: Response) => {
  const loggerService = new LoggerService();

  await loggerService.createLog({
    name: "[facebookEvent] Incoming request",
    body: JSON.stringify(req.body),
  });

  if (
    req.body.entry[0] &&
    req.body.entry[0].changes &&
    req.body.entry[0].changes[0] &&
    req.body.entry[0].changes[0].field === "messages" &&
    req.body.entry[0].changes[0].value &&
    req.body.entry[0].changes[0].value.messages &&
    req.body.entry[0].changes[0].value.messages[0] &&
    req.body.entry[0].changes[0].value.messages[0].id &&
    (req.body.entry[0].changes[0].value.messages[0].type === "text" ||
      req.body.entry[0].changes[0].value.messages[0].type === "interactive")
  ) {
    const facebookService = new FacebookService();
    const fromNumber = req.body.entry[0].changes[0].value.messages[0].from;
    const eventId = req.body.entry[0].changes[0].value.messages[0].id;
    let command: string = "";

    if (req.body.entry[0].changes[0].value.messages[0].type === "text") {
      const text = req.body.entry[0].changes[0].value.messages[0].text.body;
      command = text.split(" ")[0].toLowerCase();
    }

    if (req.body.entry[0].changes[0].value.messages[0].type === "interactive") {
      const replyId =
        req.body.entry[0].changes[0].value.messages[0].interactive.button_reply
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

    await loggerService.createLog({
      name: "[facebookEvent] - Command",
      body: `${eventId} ${fromNumber} ${command}`,
    });

    switch (command) {
      case "ordine":
        await facebookService.acceptOrder(
          req.body.entry[0].changes[0].value.messages[0].text.body,
          fromNumber
        );
        break;
      case "poke":
        await facebookService.sendMessage(WhatsappMessage.Poke, fromNumber);
        break;
      case "pokediy":
        await facebookService.sendMessage(WhatsappMessage.PokeDIY, fromNumber);
        break;
      case "burrito":
        await facebookService.sendMessage(WhatsappMessage.Burrito, fromNumber);
        break;
      case "more":
        await facebookService.sendMessage(WhatsappMessage.More, fromNumber);
        break;
      case "salad":
        await facebookService.sendMessage(WhatsappMessage.Salad, fromNumber);
        break;
      case "pita":
        await facebookService.sendMessage(WhatsappMessage.Pita, fromNumber);
        break;
      case "drinks":
        await facebookService.sendMessage(WhatsappMessage.Drinks, fromNumber);
        break;
      default:
        await facebookService.sendMessage(WhatsappMessage.Intro, fromNumber);
    }
  }

  res.status(200).send(process.env.FACEBOOK_ACCESS_TOKEN);
};
