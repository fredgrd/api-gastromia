import { AWSError, S3 } from "aws-sdk";
import { Buffer } from "node:buffer";
import { v4 as uuidv4 } from "uuid";

class S3Service {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
  }

  async getObject() {
    const params: S3.GetObjectRequest = {
      Key: "items/drinks/cocacola_preview.jpeg",
      Bucket: process.env.AWS_BUCKET_NAME || "",
    };

    const object = await this.s3.getObject(params).promise();

    console.log("OBJECT", object);
  }

  async uploadImage(base64: string, type: string): Promise<string | null> {
    const key: string = `media-${uuidv4()}.${type.replace("image/", "")}`;
    const buffer: Buffer = Buffer.from(
      base64.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const params: S3.PutObjectRequest = {
      Bucket: `${process.env.AWS_BUCKET_NAME}/items`,
      Key: key,
      Body: buffer,
      ContentEncoding: "base64",
      ContentType: type,
    };

    try {
      await this.s3.putObject(params).promise();
      return key;
    } catch (error) {
      const awsError = error as AWSError;
      console.log(`UploadImage error: ${awsError.name} ${awsError.message}`);
      return null;
    }
  }
}

export default S3Service;
