import * as Minio from 'minio';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'admin',
  secretKey: 'password123'
});

const BUCKET_NAME = 'social-media-posts';

const ensureBucket = async (): Promise<void> => {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (exists) return;

  await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
  const policy = {
    Version: "2012-10-17",
    Statement: [{
      Action: ["s3:GetObject"],
      Effect: "Allow",
      Principal: "*",
      Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
    }]
  };
  await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
};

export const uploadAndCompressImage = async (fileBuffer: Buffer): Promise<string> => {
  const webpBuffer = await sharp(fileBuffer)
    .webp({ quality: 80 })
    .toBuffer();

  const fileName = `${uuidv4()}.webp`;

  await ensureBucket();
  await minioClient.putObject(BUCKET_NAME, fileName, webpBuffer, webpBuffer.length, {
    'Content-Type': 'image/webp'
  });

  return `http://localhost:9000/${BUCKET_NAME}/${fileName}`;
};

export const uploadRawFile = async (
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
): Promise<string> => {
  const extension = originalName.includes(".")
    ? originalName.split(".").pop()
    : "bin";
  const fileName = `${uuidv4()}.${extension}`;

  await ensureBucket();
  await minioClient.putObject(BUCKET_NAME, fileName, fileBuffer, fileBuffer.length, {
    'Content-Type': mimeType || 'application/octet-stream'
  });

  return `http://localhost:9000/${BUCKET_NAME}/${fileName}`;
};
