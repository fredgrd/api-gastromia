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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.completeVerification = exports.startVerification = void 0;
const twilioService_1 = require("../services/twilioService");
const userModel_1 = require("../models/userModel");
const jwtTokens_1 = require("../helpers/jwtTokens");
const startVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const number = req.body.number;
    const twilioService = new twilioService_1.TwilioService();
    // Lookup number
    const lookupNumber = yield twilioService.lookupNumber(number);
    switch (lookupNumber) {
        case twilioService_1.TwilioService.LookupNumberStatus.Failed:
            res.sendStatus(500);
            return;
        case twilioService_1.TwilioService.LookupNumberStatus.LookupError:
            res.sendStatus(400);
            return;
    }
    // Create verification attempt
    const verificationAttempt = yield twilioService.createVerificationAttempt(number);
    switch (verificationAttempt) {
        case twilioService_1.TwilioService.CreateVerificationAttemptStatus.Success:
            res.sendStatus(200);
            break;
        case twilioService_1.TwilioService.CreateVerificationAttemptStatus.Failed:
        case twilioService_1.TwilioService.CreateVerificationAttemptStatus.AttemptError:
            res.sendStatus(400);
            break;
        case twilioService_1.TwilioService.CreateVerificationAttemptStatus.ServiceError:
            res.sendStatus(500);
            break;
    }
});
exports.startVerification = startVerification;
const completeVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const number = req.body.number;
    const code = req.body.code;
    const twilioService = new twilioService_1.TwilioService();
    // Code check
    const codeCheck = yield twilioService.createVerificationCheck(number, code);
    switch (codeCheck) {
        case twilioService_1.TwilioService.CreateVerificationCheckStatus.Success:
            // Try find the user
            try {
                const user = yield userModel_1.User.findOne({ number: number }).orFail();
                // Set cookie
                const token = (0, jwtTokens_1.signAuthToken)({
                    id: user.id,
                    stripe_id: user.stripe_id,
                    number: user.number,
                });
                res.cookie("auth_token", token, {
                    maxAge: 60 * 60 * 24 * 10 * 1000,
                    httpOnly: true,
                    secure: true,
                });
                res.status(200).json({ user: user, status: "UserExists" });
                return;
            }
            catch (error) {
                const mongooseError = error;
                if (mongooseError.name !== "DocumentNotFoundError") {
                    console.log(`CheckVerification error: ${mongooseError.name}`);
                    res.sendStatus(500);
                    return;
                }
            }
            // If user does not exist create a SignupToken
            const token = (0, jwtTokens_1.signSignupToken)(number);
            res.cookie("signup_token", token, {
                maxAge: 60 * 10 * 1000,
                httpOnly: true,
                secure: true,
            });
            res.status(200).json({ user: null, status: "NewUser" });
            break;
        case twilioService_1.TwilioService.CreateVerificationCheckStatus.Failed:
        case twilioService_1.TwilioService.CreateVerificationCheckStatus.CheckError:
            res.sendStatus(400);
            break;
        case twilioService_1.TwilioService.CreateVerificationCheckStatus.ServiceError:
            res.sendStatus(500);
            break;
    }
});
exports.completeVerification = completeVerification;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("signup_token");
    res.sendStatus(200);
});
exports.logout = logout;
