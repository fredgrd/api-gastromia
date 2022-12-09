import { Request, Response } from "express";
import { TwilioService } from "../services/twilioService";
import { UserService } from "../services/userService";

export const startVerification = async (req: Request, res: Response) => {
  const number = req.body.number;
  const client = new TwilioService();

  // Lookup number
  const lookupNumber = await client.lookupNumber(number);
  switch (lookupNumber) {
    case TwilioService.LookupNumberStatus.Failed:
      res.sendStatus(500);
      return;
    case TwilioService.LookupNumberStatus.LookupError:
      res.sendStatus(400);
      return;
  }

  // Create verification attempt
  const verificationAttempt = await client.createVerificationAttempt(number);
  switch (verificationAttempt) {
    case TwilioService.CreateVerificationAttemptStatus.Success:
      res.sendStatus(200);
      break;
    case TwilioService.CreateVerificationAttemptStatus.Failed:
    case TwilioService.CreateVerificationAttemptStatus.AttemptError:
      res.sendStatus(400);
      break;
    case TwilioService.CreateVerificationAttemptStatus.ServiceError:
      res.sendStatus(500);
      break;
  }
};

export const checkVerification = async (req: Request, res: Response) => {
  const number = req.body.number;
  const code = req.body.code;
  const client = new TwilioService();
  const userService = new UserService();

  // Code check
  const codeCheck = await client.createVerificationCheck(number, code);
  switch (codeCheck) {
    case TwilioService.CreateVerificationCheckStatus.Success:
      const token = userService.signToken(number);
      const foundUser = await userService.fetchUser(number || "");

      res.cookie("token", token, {
        maxAge: 60 * 60 * 24 * 10 * 1000, // 60s * 60m * 24h * 10d => 10 Days in secods => in milliseconds
        httpOnly: true,
        secure: true,
      });

      if (foundUser) {
        res.status(200).json({
          id: foundUser._id,
          name: foundUser.name,
          number: foundUser.number,
        });
      } else {
        res.status(200).json();
      }
      break;
    case TwilioService.CreateVerificationCheckStatus.Failed:
    case TwilioService.CreateVerificationCheckStatus.CheckError:
      res.sendStatus(400);
      break;
    case TwilioService.CreateVerificationCheckStatus.ServiceError:
      res.sendStatus(500);
      break;
  }
};
