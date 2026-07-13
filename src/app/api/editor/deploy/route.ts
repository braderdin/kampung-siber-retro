// Start: Neocities-Style Editor Deploy Route (Cloudflare R2 S3-Compatible)
// Uploads raw HTML/CSS/JS file content directly to the R2 bucket and returns the
// public asset URL. Optionally updates the deployer's profiles.website column.
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getServerSupabase } from '@/lib/supabase-server';

// Start: Type Definitions
interface DeployFile {
  filename: string;
  content: string;
}

interface DeployRequestBody {
  userId?: string;
  username?: string;
  files: DeployFile[];
}

interface DeployResult {
  filename: string;
  url: string;
  contentType: string;
  size: number;
}

interface DeployResponse {
  success: boolean;
  data?: {
    files: DeployResult[];
    siteUrl: string | null;
    profileUpdated: boolean;
  };
  error?: string;
}
// End: Type Definitions

// Start: Environment Configuration Boundary
const CLOUDFLARE_R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID || '';
const CLOUDFLARE_R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
const CLOUDFLARE_R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
const CLOUDFLARE_R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'kampung-siber-assets';
// Optional public gateway for the bucket (e.g. https://pub-xxxx.r2.dev or custom domain)
const CLOUDFLARE_R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || '';
// End: Environment Configuration Boundary

// Start: S3 Client Configuration (R2 S3-Compatible Endpoint)
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});
// End: S3 Client Configuration

// Start: Content-Type Resolution Map
function resolveContentType(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.html') || lower.endsWith('.htm')) return 'text/html; charset=utf-8';
  if (lower.endsWith('.css')) return 'text/css; charset=utf-8';
  if (lower.endsWith('.js') || lower.endsWith('.mjs')) return 'application/javascript; charset=utf-8';
  if (lower.endsWith('.json')) return 'application/json; charset=utf-8';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  if (lower.endsWith('.txt')) return 'text/plain; charset=utf-8';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.ico')) return 'image/x-icon';
  return 'application/octet-stream';
}
// End: Content-Type Resolution Map

// Start: Public URL Builder
function buildPublicUrl(objectKey: string): string {
  if (CLOUDFLARE_R2_PUBLIC_URL) {
    return `${CLOUDFLARE_R2_PUBLIC_URL.replace(/\/$/, '')}/${objectKey}`;
  }
  return `https://${CLOUDFLARE_R2_BUCKET_NAME}.${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${objectKey}`;
}
// End: Public URL Builder

// Start: POST Handler - Deploy files to R2
export async function POST(request: NextRequest): Promise<NextResponse<DeployResponse>> {
  // Start: Credential Guard
  if (!CLOUDFLARE_R2_ACCOUNT_ID || !CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
    return NextResponse.json({
      success: false,
      error: 'Cloudflare R2 credentials are not configured. Please set CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, and CLOUDFLARE_R2_SECRET_ACCESS_KEY.',
    }, { status: 500 });
  }
  // End: Credential Guard

  try {
    // Start: Parse + Validate Request
    const body = (await request.json()) as DeployRequestBody;
    if (!Array.isArray(body.files) || body.files.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing required field: files (array of { filename, content })',
      }, { status: 400 });
    }

    const allowed = ['index.html', 'styles.css', 'script.js'];
    const results: DeployResult[] = [];

    for (const file of body.files) {
      if (!file.filename || typeof file.content !== 'string') {
        return NextResponse.json({
          success: false,
          error: 'Each file must include a filename and content string.',
        }, { status: 400 });
      }
      if (!allowed.includes(file.filename.toLowerCase())) {
        return NextResponse.json({
          success: false,
          error: `Unsupported filename "${file.filename}". Allowed: ${allowed.join(', ')}`,
        }, { status: 400 });
      }

      const safeName = file.filename.replace(/[^a-zA-Z0-9._-]/g, '');
      const userPath = (body.username || body.userId || 'anonymous').replace(/[^a-zA-Z0-9_-]/g, '');
      const objectKey = `sites/${userPath}/${safeName}`;
      const contentType = resolveContentType(safeName);
      const buffer = Buffer.from(file.content, 'utf-8');

      const command = new PutObjectCommand({
        Bucket: CLOUDFLARE_R2_BUCKET_NAME,
        Key: objectKey,
        Body: buffer,
        ContentType: contentType,
        CacheControl: 'no-cache',
      });

      await s3Client.send(command);
      results.push({
        filename: safeName,
        url: buildPublicUrl(objectKey),
        contentType,
        size: buffer.byteLength,
      });
    }
    // End: Parse + Validate Request

    // Start: Derive Primary Site URL (index.html)
    const indexResult = results.find((r) => r.filename.toLowerCase() === 'index.html');
    const siteUrl = indexResult ? indexResult.url : (results[0]?.url ?? null);

    // Start: Profile Binding (Supabase)
    let profileUpdated = false;
    if (siteUrl && (body.userId || body.username)) {
      try {
        const supabase = getServerSupabase();
        const identifier = body.userId ?? body.username!;
        const column = body.userId ? 'id' : 'username';
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ website: siteUrl })
          .eq(column, identifier);
        if (!updateError) profileUpdated = true;
      } catch (supaError) {
        console.error('Profile update skipped (non-fatal):', supaError);
      }
    }
    // End: Profile Binding

    // Start: Success Response
    return NextResponse.json({
      success: true,
      data: {
        files: results,
        siteUrl,
        profileUpdated,
      },
    }, { status: 200 });
    // End: Success Response
  } catch (error) {
    console.error('Editor Deploy API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({
      success: false,
      error: `Failed to deploy to Cloudflare R2: ${errorMessage}`,
    }, { status: 500 });
  }
}
// End: POST Handler