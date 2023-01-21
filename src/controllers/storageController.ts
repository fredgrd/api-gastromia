import { Request, Response } from "express";
import authenticateOperator from "../helpers/authenticateOperator";
import S3Service from "../services/s3Service";

// Uploads an image to the Gastromia Bucket in S3
export const uplodaImage = async (req: Request, res: Response) => {
  const operatorToken = authenticateOperator(req, res, "UploadImage");

  if (!operatorToken) {
    return;
  }

  const base64: string | any = req.body.base64;
  const type: string | any = req.body.type;

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

  const s3 = new S3Service();
  const key = await s3.uploadImage(base64, type);

  if (key) {
    const url = `https://dzfokbljn6tmk.cloudfront.net/items/${key}`;
    res.status(200).json({ image_url: url });
  } else {
    res.sendStatus(500);
  }
};
