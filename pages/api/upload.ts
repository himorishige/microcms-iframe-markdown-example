import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.headers["content-type"]?.includes("multipart/form-data")) {
    res.status(400).send(undefined);
    return;
  }

  const { err, mimetype, fileName } = await uploadImage(req);

  if (err) {
    res.status(500).send(undefined);
    return;
  }

  res.status(200).json({
    fileName,
    mimetype,
  });
}

const uploadImage = async (
  req: NextApiRequest
): Promise<{
  fileName: string;
  mimetype: string;
  err?: Error;
}> => {
  const form = new formidable.IncomingForm();

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("upload timeout"));
    }, 60_000);

    form.parse(req, async (err, fields, files) => {
      clearTimeout(timeoutId);
      if (err) {
        reject(err);
      }

      if (!Object.hasOwn(files, "file")) {
        reject(new Error("imageFile not specified."));
      }

      // フロントエンド側の処理で画像は１つ
      const file = files.file as formidable.File;
      const fileName = fields.fileName as string;

      const filePath = fs.readFileSync(file.filepath);

      // R2 Client
      const client = new S3Client({
        endpoint: process.env.R2_ENDPOINT,
        region: "auto",
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY!,
          secretAccessKey: process.env.R2_SECRET_KEY!,
        },
      });

      const params: PutObjectCommandInput = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
        Key: fileName,
        ContentType: file.mimetype ?? "application/octet-stream",
        CacheControl: "public, max-age=31536000",
        Body: filePath,
      };

      const uploadRes = await client.send(new PutObjectCommand(params));
      console.log("Success", uploadRes);

      resolve({
        fileName,
        mimetype: file.mimetype ?? "application/octet-stream",
        err,
      });
    });
  });
};
