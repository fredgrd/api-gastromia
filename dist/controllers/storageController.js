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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uplodaImage = void 0;
const authenticateOperator_1 = __importDefault(require("../helpers/authenticateOperator"));
const s3Service_1 = __importDefault(require("../services/s3Service"));
// Uploads an image to the Gastromia Bucket in S3
const uplodaImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const operatorToken = (0, authenticateOperator_1.default)(req, res, "UploadImage");
    if (!operatorToken) {
        return;
    }
    const base64 = req.body.base64;
    const type = req.body.type;
    if (!base64 || typeof base64 !== "string") {
        console.log("UploadImage error: MissingBase64Image");
        res.sendStatus(400);
        return;
    }
    if (!type || typeof type !== "string") {
        console.log("UploadImage error: MissingImageType");
        res.sendStatus(400);
        return;
    }
    const s3 = new s3Service_1.default();
    const key = yield s3.uploadImage(base64, type);
    if (key) {
        const url = `https://dzfokbljn6tmk.cloudfront.net/items/${key}`;
        res.status(200).json({ image_url: url });
    }
    else {
        res.sendStatus(500);
    }
});
exports.uplodaImage = uplodaImage;
