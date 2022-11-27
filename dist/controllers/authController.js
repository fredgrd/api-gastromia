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
exports.checkVerification = exports.startVerification = void 0;
const twilioService_1 = require("../services/twilioService");
const userService_1 = require("../services/userService");
const startVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const number = req.body.number;
    const client = new twilioService_1.TwilioService();
    // Lookup number
    const lookupNumber = yield client.lookupNumber(number);
    switch (lookupNumber) {
        case twilioService_1.TwilioService.LookupNumberStatus.Failed:
            res.sendStatus(500);
            return;
        case twilioService_1.TwilioService.LookupNumberStatus.LookupError:
            res.sendStatus(400);
            return;
    }
    // Create verification attempt
    const verificationAttempt = yield client.createVerificationAttempt(number);
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
const checkVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const number = req.body.number;
    const code = req.body.code;
    const client = new twilioService_1.TwilioService();
    const userService = new userService_1.UserService();
    // Code check
    const codeCheck = yield client.createVerificationCheck(number, code);
    switch (codeCheck) {
        case twilioService_1.TwilioService.CreateVerificationCheckStatus.Success:
            const token = userService.signToken(number);
            res.status(200).json({ token: token });
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
exports.checkVerification = checkVerification;
