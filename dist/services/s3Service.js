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
const aws_sdk_1 = require("aws-sdk");
const node_buffer_1 = require("node:buffer");
const uuid_1 = require("uuid");
class S3Service {
    constructor() {
        this.s3 = new aws_sdk_1.S3({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
        });
    }
    getObject() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                Key: "items/drinks/cocacola_preview.jpeg",
                Bucket: process.env.AWS_BUCKET_NAME || "",
            };
            const object = yield this.s3.getObject(params).promise();
            console.log("OBJECT", object);
        });
    }
    uploadImage(base64, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `media-${(0, uuid_1.v4)()}.${type.replace("image/", "")}`;
            const buffer = node_buffer_1.Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");
            const params = {
                Bucket: `${process.env.AWS_BUCKET_NAME}/items`,
                Key: key,
                Body: buffer,
                ContentEncoding: "base64",
                ContentType: type,
            };
            try {
                yield this.s3.putObject(params).promise();
                return key;
            }
            catch (error) {
                const awsError = error;
                console.log(`UploadImage error: ${awsError.name} ${awsError.message}`);
                return null;
            }
        });
    }
}
exports.default = S3Service;
