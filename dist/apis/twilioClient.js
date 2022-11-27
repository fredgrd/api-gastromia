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
                    return TwilioClient.LookupNumberStatus.Success;
                }
                else {
                    return TwilioClient.LookupNumberStatus.Failed;
                }
            }
            catch (error) {
                console.log(`LookupNumber error: ${error}`);
                return TwilioClient.LookupNumberStatus.LookupError;
            }
        });
    }
    createVerificationAttempt(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
            if (serviceSid) {
                console.log(`About to create a verification attempt for: ${number}`);
                try {
                    const attempt = yield this.client.verify.v2
                        .services(serviceSid)
                        .verifications.create({ to: number, channel: "sms" });
                    if (attempt.status === "pending") {
                        console.log(`Verification attempt started for: ${number}`);
                        return TwilioClient.CreateVerificationAttemptStatus.Success;
                    }
                    else {
                        console.log(`Verification attempt failed for: ${number}`);
                        return TwilioClient.CreateVerificationAttemptStatus.Failed;
                    }
                }
                catch (error) {
                    console.log(`CreateVerificationAttempt error: ${error}`);
                    return TwilioClient.CreateVerificationAttemptStatus.AttemptError;
                }
            }
            else {
                return TwilioClient.CreateVerificationAttemptStatus.ServiceError;
            }
        });
    }
    createVerificationCheck(number, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
            if (serviceSid) {
                console.log(`About to create a verification check for: ${number}, with code: ${code}`);
                try {
                    const check = yield this.client.verify.v2
                        .services(serviceSid)
                        .verificationChecks.create({ to: number, code: code });
                    if (check.status === "approved") {
                        console.log("Verification check approved");
                        return TwilioClient.CreateVerificationCheckStatus.Success;
                    }
                    else {
                        console.log("Verification check failed");
                        return TwilioClient.CreateVerificationCheckStatus.Failed;
                    }
                }
                catch (error) {
                    console.log(`CreateVerificationCheck error: ${error}`);
                    return TwilioClient.CreateVerificationCheckStatus.CheckError;
                }
            }
            else {
                return TwilioClient.CreateVerificationCheckStatus.ServiceError;
            }
        });
    }
}
exports.TwilioClient = TwilioClient;
(function (TwilioClient) {
    let CreateVerificationCheckStatus;
    (function (CreateVerificationCheckStatus) {
        CreateVerificationCheckStatus[CreateVerificationCheckStatus["Success"] = 0] = "Success";
        CreateVerificationCheckStatus[CreateVerificationCheckStatus["Failed"] = 1] = "Failed";
        CreateVerificationCheckStatus[CreateVerificationCheckStatus["CheckError"] = 2] = "CheckError";
        CreateVerificationCheckStatus[CreateVerificationCheckStatus["ServiceError"] = 3] = "ServiceError";
    })(CreateVerificationCheckStatus = TwilioClient.CreateVerificationCheckStatus || (TwilioClient.CreateVerificationCheckStatus = {}));
    let LookupNumberStatus;
    (function (LookupNumberStatus) {
        LookupNumberStatus[LookupNumberStatus["Success"] = 0] = "Success";
        LookupNumberStatus[LookupNumberStatus["Failed"] = 1] = "Failed";
        LookupNumberStatus[LookupNumberStatus["LookupError"] = 2] = "LookupError";
    })(LookupNumberStatus = TwilioClient.LookupNumberStatus || (TwilioClient.LookupNumberStatus = {}));
    let CreateVerificationAttemptStatus;
    (function (CreateVerificationAttemptStatus) {
        CreateVerificationAttemptStatus[CreateVerificationAttemptStatus["Success"] = 0] = "Success";
        CreateVerificationAttemptStatus[CreateVerificationAttemptStatus["Failed"] = 1] = "Failed";
        CreateVerificationAttemptStatus[CreateVerificationAttemptStatus["AttemptError"] = 2] = "AttemptError";
        CreateVerificationAttemptStatus[CreateVerificationAttemptStatus["ServiceError"] = 3] = "ServiceError";
    })(CreateVerificationAttemptStatus = TwilioClient.CreateVerificationAttemptStatus || (TwilioClient.CreateVerificationAttemptStatus = {}));
})(TwilioClient = exports.TwilioClient || (exports.TwilioClient = {}));
