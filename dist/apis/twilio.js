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
exports.TwilioClient = void 0;
const twilio_1 = require("twilio");
class TwilioClient {
    constructor() {
        this.accountSid = process.env.TWILIO_ACCOUNT_SID || "";
        this.authToken = process.env.TWILIO_AUTH_TOKEN || "";
        this.client = new twilio_1.Twilio(this.accountSid, this.authToken);
    }
    lookupNumber(number) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const phoneNumber = yield this.client.lookups.v1
                    .phoneNumbers(number)
                    .fetch();
                if (phoneNumber) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    createVerificationAttempt(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
            if (serviceSid) {
                const attempt = yield this.client.verify.v2
                    .services(serviceSid)
                    .verifications.create({ to: number, channel: "sms" });
                console.log("attempt");
                return true;
            }
            else {
                return false;
            }
        });
    }
}
exports.TwilioClient = TwilioClient;
