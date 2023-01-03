import { Request, Response } from "express";
import { TwilioService } from "../services/twilioService";
import { User } from "../models/userModel";
import { signAuthToken, signSignupToken } from "../helpers/jwtTokens";
import { MongooseError } from "mongoose";

export const startVerification = async (req: Request, res: Response) => {
  const number = req.body.number;
  const twilioService = new TwilioService();

  // Lookup number
  const lookupNumber = await twilioService.lookupNumber(number);
  switch (lookupNumber) {
    case TwilioService.LookupNumberStatus.Failed:
      res.sendStatus(500);
      return;
    case TwilioService.LookupNumberStatus.LookupError:
      res.sendStatus(400);
      return;
  }

  // Create verification attempt
  const verificationAttempt = await twilioService.createVerificationAttempt(
    number
  );
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

export const completeVerification = async (req: Request, res: Response) => {
  const number = req.body.number;
  const code = req.body.code;
  const twilioService = new TwilioService();

  // Code check
  const codeCheck = await twilioService.createVerificationCheck(number, code);
  switch (codeCheck) {
    case TwilioService.CreateVerificationCheckStatus.Success:
      // Try find the user
      try {
        const user = await User.findOne({ number: number }).orFail();

        // Set cookie
        const token = signAuthToken({
          id: user.id,
          stripe_id: user.stripe_id,
          number: user.number,
        });
        res.cookie("auth_token", token, {
          maxAge: 60 * 60 * 24 * 10 * 1000, // 60s * 60m * 24h * 10d => 10 Days in secods => in milliseconds
          httpOnly: true,
          secure: true,
        });

        res.status(200).json({ user: user, status: "UserExists" });
        return;
      } catch (error) {
        const mongooseError = error as MongooseError;

        if (mongooseError.name !== "DocumentNotFoundError") {
          console.log(`CheckVerification error: ${mongooseError.name}`);
          res.sendStatus(500);
          return;
        }
      }

      // If user does not exist create a SignupToken
      const token = signSignupToken(number);
      res.cookie("signup_token", token, {
        maxAge: 60 * 10 * 1000, // 60s * 10m => 10 minutes in seconds => in milliseconds
        httpOnly: true,
        secure: true,
      });

      res.status(200).json({ user: null, status: "NewUser" });
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

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("auth_token");
  res.sendStatus(200);
};
