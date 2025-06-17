import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3Client";
import { RequestHandler } from "express";

export const s3Uploader: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const { originalname, buffer } = req.file;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `uploads/${Date.now()}_${originalname}`,
      Body: buffer,
      ContentType: req.file.mimetype,
    };

    // Upload the file to S3
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Respond with the file URL
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${params.Key}`;
    res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error("S3 upload error:", error);
    res.status(500).send("Error uploading file to S3.");
  }
};
