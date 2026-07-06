// Start: Cloudflare R2 Storage API Handler
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Start: Type Definitions
interface StorageMetadata {
  id: string;
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
  contentType: string;
  bucketPath: string;
  presignedUrl?: string;
}

interface UploadRequest {
  filename: string;
  fileContent: string;
  contentType: string;
  size: number;
}

interface StorageResponse {
  success: boolean;
  data?: StorageMetadata;
  error?: string;
}
// End: Type Definitions

// Start: Environment Configuration
const CLOUDFLARE_R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID || '';
const CLOUDFLARE_R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
const CLOUDFLARE_R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
const CLOUDFLARE_R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'kampung-siber-assets';
// End: Environment Configuration

// Start: S3 Client Configuration
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflaredevices.com`,
  credentials: {
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});
// End: S3 Client Configuration

// Start: Metadata Token Generator
function generateMetadataToken(filename: string, bucketPath: string): StorageMetadata {
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const url = `https://${CLOUDFLARE_R2_BUCKET_NAME}.${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflaredevices.com/${bucketPath}/${filename}`;
  
  return {
    id,
    filename,
    url,
    size: 0,
    uploadedAt: new Date().toISOString(),
    contentType: '',
    bucketPath,
  };
}
// End: Metadata Token Generator

// Start: Generate Presigned Upload URL
async function generatePresignedUrl(key: string, contentType: string, size: number): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      ContentLength: size,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error('Failed to generate presigned URL:', error);
    throw error;
  }
}
// End: Generate Presigned Upload URL

// Start: Verify Object Exists
async function verifyObjectExists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
}
// End: Verify Object Exists

// Start: POST Handler
export async function POST(request: NextRequest): Promise<NextResponse<StorageResponse>> {
  // Start: Request Validation
  if (!CLOUDFLARE_R2_ACCOUNT_ID || !CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
    return NextResponse.json({
      success: false,
      error: 'Cloudflare R2 credentials are not configured. Please check your environment variables.',
    }, { status: 500 });
  }
  // End: Request Validation

  try {
    // Start: Parse Request Body
    const body: UploadRequest = await request.json();
    // End: Parse Request Body

    // Start: Validate Required Fields
    if (!body.filename || !body.fileContent || !body.contentType || !body.size) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: filename, fileContent, contentType, size',
      }, { status: 400 });
    }
    // End: Validate Required Fields

    // Start: Size Validation (25MB limit)
    const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes
    if (body.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        success: false,
        error: `File size exceeds 25MB limit. Current size: ${(body.size / 1024 / 1024).toFixed(2)}MB`,
      }, { status: 400 });
    }
    // End: Size Validation

    // Start: Bucket Path Generation
    const timestamp = new Date().toISOString().split('T')[0];
    const bucketPath = `assets/${timestamp}`;
    const objectKey = `${bucketPath}/${body.filename}`;
    // End: Bucket Path Generation

    // Start: Metadata Token Creation
    const metadata = generateMetadataToken(body.filename, bucketPath);
    // End: Metadata Token Creation

    // Start: Generate Presigned Upload URL
    try {
      const presignedUrl = await generatePresignedUrl(objectKey, body.contentType, body.size);
      metadata.presignedUrl = presignedUrl;
    } catch (presignError) {
      console.error('Presigned URL Generation Error:', presignError);
      return NextResponse.json({
        success: false,
        error: 'Failed to generate secure upload URL. Please try again.',
      }, { status: 500 });
    }
    // End: Generate Presigned Upload URL

    // Start: Update Metadata with Size
    metadata.size = body.size;
    metadata.contentType = body.contentType;
    // End: Update Metadata with Size

    // Start: Success Response
    return NextResponse.json({
      success: true,
      data: metadata,
    }, { status: 200 });
    // End: Success Response

  } catch (error) {
    // Start: Error Handling
    console.error('Storage API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({
      success: false,
      error: `Failed to process storage request: ${errorMessage}`,
    }, { status: 500 });
    // End: Error Handling
  }
}
// End: POST Handler
