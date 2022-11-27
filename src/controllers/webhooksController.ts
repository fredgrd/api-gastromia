import { Request, Response } from "express";
import axios from "axios";
import { LoggerService } from "../services/loggerService";
import { WhatsappMessage, FacebookService } from "../services/facebookService";

export const test = async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      "https://graph.facebook.com/v15.0/100711486214814/messages",
      {
        messaging_product: "whatsapp",
        to: "393478842092",
        type: "template",
        template: {
          name: "hello_world",
          language: {
            code: "en_US",
          },
        },
      },
      {
        headers: {
          Authorization:
            "Bearer EAAGliejcNi4BAMlAKATPspUvS8ZChgCg6DLb0uBOYyQQqARcYpOPSqB6ZAScnHMnOMJw4RkLhKwbM5IIadHRgrE0zc7C7K9ZAwmfzZCdWJAkAL26dYUwU6Jt7JPxpKorZCWRMz0ZCNUeAPND3t8ZB136DKBqxq9dycrRDidpyH5qGjqoSKWgB6bMPIfpqYfagup8kZBpaXJ4Ts8CUYEupSuiFcaumXPmdV0ZD",
        },
      }
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

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
    name: "facebookEvent",
    body: `Started`,
  });

  await loggerService.createLog({
    name: "facebookEvent",
    body: JSON.stringify(req.body),
  });

  console.log(JSON.stringify(req.body));

  if (
    req.body.entry[0] &&
    req.body.entry[0].changes &&
    req.body.entry[0].changes[0] &&
    req.body.entry[0].changes[0].field === "messages" &&
    req.body.entry[0].changes[0].value &&
    req.body.entry[0].changes[0].value.messages &&
    req.body.entry[0].changes[0].value.messages[0] &&
    (req.body.entry[0].changes[0].value.messages[0].type === "text" ||
      req.body.entry[0].changes[0].value.messages[0].type === "interactive")
  ) {
    const facebookService = new FacebookService();
    const fromNumber = req.body.entry[0].changes[0].value.messages[0].from;
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
        default:
          command = "ciao";
      }

      await loggerService.createLog({
        name: "facebookEvent - interactive",
        body: `${fromNumber} ${command} ${replyId}`,
      });
    }

    await loggerService.createLog({
      name: "facebookEvent",
      body: `${fromNumber} ${command}`,
    });

    switch (command) {
      case "ordine":
        await facebookService.acceptOrder(
          req.body.entry[0].changes[0].value.messages[0].text.body
        );
        break;
      case "poke":
        await loggerService.createLog({
          name: "facebookEvent - sending poke",
          body: `${fromNumber} ${command}`,
        });

        await facebookService.sendMessage(WhatsappMessage.Poke, fromNumber);
        break;
      case "pokediy":
        await facebookService.sendMessage(WhatsappMessage.PokeDIY, fromNumber);
        break;
      case "altro":
        await facebookService.sendMessage(WhatsappMessage.More, fromNumber);
        break;
      default:
        await loggerService.createLog({
          name: "facebookEvent - sending default",
          body: `${fromNumber} ${command}`,
        });
        await facebookService.sendMessage(WhatsappMessage.Intro, fromNumber);
    }
  }

  res.status(200).send(process.env.FACEBOOK_ACCESS_TOKEN);
};
