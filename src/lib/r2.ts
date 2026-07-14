// Start: Kampung Siber Cloudflare R2 Storage Client (Rule 30 & 35)
// Guard-first client: validateR2Env() runs BEFORE the S3 client is built so
// missing/placeholder R2 keys hard-fail in production instead of causing
// silent upload failures at request time.

import { validateR2Env } from "./env-validation";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Enforce Rule 30 storage limits at the client boundary.
const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2MB per individual upload

// Start: r2Client — built only after env guard passes
validateR2Env();

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID as string;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID as string;
const R2_SECRET_ACCESS_KEY = process.env
  .CLOUDFLARE_R2_SECRET_ACCESS_KEY as string;
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME as string;

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});
// End: r2Client

// Start: uploadToR2 — guarded put with 2MB ceiling (Rule 30)
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<string> {
  const size =
    typeof body === "string" ? Buffer.byteLength(body) : body.length;
  if (size > MAX_FILE_BYTES) {
    throw new Error(
      `[R2] File ${key} exceeds 2MB cap (Rule 30). Got ${size} bytes.`
    );
  }

  const input: PutObjectCommandInput = {
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  };

  await r2Client.send(new PutObjectCommand(input));
  return key;
}
// End: uploadToR2

// Start: getR2PresignedUrl — short-lived read link
export async function getR2PresignedUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  return getSignedUrl(
    r2Client,
    new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }),
    { expiresIn }
  );
}
// End: getR2PresignedUrl

// Start: deleteFromR2 — guarded removal
export async function deleteFromR2(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key })
  );
}
// End: deleteFromR2

export const R2_BUCKET = R2_BUCKET_NAME;
// End: Kampung Siber Cloudflare R2 Storage Client (Rule 30 & 35)