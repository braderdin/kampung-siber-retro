// Start: Cloudflare R2 Storage Upload Handler for Text Editor
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sanitizeHtmlPayload, sanitizeCssPayload, sanitizeJsPayload, getFileTypeFromFilename } from '@/utils/sanitizeHtmlPayload'; // Start: Import Sanitization Utilities

const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
const MAX_TEXT_SIZE = 500 * 1024; // 500KB for text content
const R2_FREE_TIER_LIMIT = 100 * 1024 * 1024; // 100MB Cloudflare free tier safety limit
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
  "application/json",
  "text/html",
  "text/css",
  "text/javascript",
];
// End: Configuration Constants

// Initialize Supabase client for session authentication
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Start: R2 Configuration Constants
const R2_ENDPOINT = process.env.R2_ENDPOINT || 'https://account.r2.cloudflarestorage.com';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'kampung-siber-sites';
// End: R2 Configuration Constants

// Start: Session Authentication Helper
async function authenticateSession(req: NextRequest): Promise<{ authenticated: boolean; userId?: string }> {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authenticated: false };
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { authenticated: false };
    }

    return { authenticated: true, userId: user.id };
  } catch (error) {
    console.error('Session authentication error:', error);
    // Formal Malay: "Ralat pengesahan sesi umum."
    return { authenticated: false };
  }
}
// End: Session Authentication Helper

// Start: Upload Request Interface
interface UploadRequest {
  file?: File;
  fileName?: string;
  content?: string;
  mimeType?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}
// End: Upload Request Interface

// Start: Upload Response Interface
interface UploadResponse {
  success: boolean;
  url?: string;
  key?: string;
  size: number;
  error?: string;
}
// End: Upload Response Interface

// Start: File Validation Interface
interface FileValidation {
  valid: boolean;
  error?: string;
  size: number;
  mimeType: string;
}
// End: File Validation Interface

// Start: Filename Sanitization Function
const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .replace(/^(\.)|(\.)$/g, "")
    .substring(0, 255);
};
// End: Filename Sanitization Function

// Start: Content Type Detection Function
const getContentTypeForSanitization = (mimeType: string): 'html' | 'css' | 'javascript' | 'unknown' => {
  if (mimeType === 'text/html' || mimeType === 'application/xhtml+xml') return 'html'; // Start: Added xhtml+xml
  if (mimeType === 'text/css') return 'css';
  if (mimeType === 'text/javascript') return 'javascript';
  return 'unknown';
};
// End: Content Type Detection Function

// Start: POST Handler for Binary File Upload
export async function POST(req: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    // Start: Session Authentication Check
    const { authenticated, userId } = await authenticateSession(req);
    
    if (!authenticated) {
      return NextResponse.json({
        success: false,
        error: 'Pengesahan diperlukan untuk muat naik fail', // Formal Malay for "Authentication required for file upload"
        size: 0,
      }, { status: 401 });
    }
    // End: Session Authentication Check

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const metadata = formData.get("metadata") ? 
      JSON.parse(formData.get("metadata") as string) : {};
    
    // Start: Safe Content Length Check
    const contentLengthHeader = req.headers.get('content-length');
    if (contentLengthHeader && parseInt(contentLengthHeader) > MAX_FILE_SIZE) { // Use MAX_FILE_SIZE for binary uploads
      return NextResponse.json({
        success: false,
        error: `Saiz fail melebihi had ${MAX_FILE_SIZE / 1024 / 1024}MB`, // Formal Malay for "File size exceeds limit"
        size: 0,
      }, { status: 413 });
    }
    // End: Safe Content Length Check

    if (!file) {
      return NextResponse.json({
        success: false,
        error: "Tiada fail yang diserakan", // Formal Malay for "No file submitted"
        size: 0,
      }, { status: 400 });
    }

    const validation = await validateFile(file);
    
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: validation.error,
        size: validation.size,
      }, { status: 400 });
    }

    // Start: Content Sanitization for Text-based Files (POST)
    let fileContentBuffer = await file.arrayBuffer();
    let fileContentString: string | undefined;

    if (validation.mimeType.startsWith('text/') || validation.mimeType === 'application/json' || validation.mimeType === 'application/xhtml+xml') {
      fileContentString = Buffer.from(fileContentBuffer).toString('utf8');
      const contentType = getContentTypeForSanitization(validation.mimeType);
      try {
        const sanitizationResult = contentType === 'html'
          ? sanitizeHtmlPayload(fileContentString).sanitized
          : contentType === 'css'
          ? sanitizeCssPayload(fileContentString)
          : sanitizeJsPayload(fileContentString); // Assuming JS for other text types if not HTML/CSS
        fileContentString = sanitizationResult;
        fileContentBuffer = new Uint8Array(Buffer.from(fileContentString, 'utf8')).buffer; // Update buffer with sanitized content
      } catch (sanitizeError) {
        console.error('Sanitization error:', sanitizeError);
        return NextResponse.json({
          success: false,
          error: sanitizeError instanceof Error ? sanitizeError.message : 'Pemprosesan kandungan tidak selamat', // Formal Malay for "Unsafe content processing"
          size: 0,
        }, { status: 400 });
      }
    }
    // End: Content Sanitization

    const sanitizedFileName = sanitizeFileName(file.name);
    // const timestamp = Date.now(); // Not used, can be removed
    const fileKey = `${userId}/${sanitizedFileName}`;

    // Start: R2 Upload Logic (Mock Implementation)
    try {
      // Placeholder for actual R2 implementation
      // const r2Client = new S3Client({ ... });
      // await r2Client.send(command);
      console.log(`Mock R2 POST upload for file: ${fileKey}, size: ${fileContentBuffer.byteLength}`);
    } catch (r2Error) {
      console.error('R2 upload error:', r2Error);
      return NextResponse.json({ success: false, error: 'Gagal memuat naik fail ke simpanan', size: 0 }, { status: 500 }); // Formal Malay for "Failed to upload file to storage"
    }
    // End: R2 Upload Logic

    const uploadResponse: UploadResponse = {
      success: true,
      url: `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${fileKey}`,
      key: fileKey, // Start: Use fileContentBuffer.byteLength for actual size
      size: fileContentBuffer.byteLength,
    };

    return NextResponse.json(uploadResponse, { status: 200 });

  } catch (error) {
    console.error("Error processing upload:", error);
    // Formal Malay: "Gagal memproses muat naik."
    return NextResponse.json({
      success: false,
      error: "Gagal memproses muat naik", // Formal Malay for "Failed to process upload"
      size: 0,
    }, { status: 500 });
  }
}
// End: POST Handler for Binary File Upload

// Start: PUT Handler for Text Content Upload (Editor)
export async function PUT(req: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    // Start: Session Authentication Check
    const { authenticated, userId } = await authenticateSession(req);
    
    if (!authenticated) {
      return NextResponse.json({
        success: false,
        error: 'Pengesahan diperlukan untuk mengemas kini kandungan', // Formal Malay for "Authentication required to update content"
        size: 0,
      }, { status: 401 });
    }
    // End: Session Authentication Check

    const body = await req.json();
    
    const { content, fileName, mimeType }: { content?: string; fileName: string; mimeType?: string } = body;

    // Start: Payload Validation
    if (!fileName) {
      return NextResponse.json({
        success: false,
        error: "Nama fail diperlukan", // Formal Malay for "File name is required"
        size: 0,
      }, { status: 400 });
    }

    if (!content && content !== '') {
      return NextResponse.json({
        success: false,
        error: "Kandungan fail diperlukan", // Formal Malay for "File content is required"
        size: 0,
      }, { status: 400 });
    }

    // Validate content size with Cloudflare free tier safety check
    const contentSize = Buffer.byteLength(content || '', 'utf8');
    if (contentSize > MAX_TEXT_SIZE) { // Use MAX_TEXT_SIZE for text content
      return NextResponse.json({
        success: false,
        error: `Saiz kandungan melebihi had ${MAX_TEXT_SIZE / 1024}KB`, // Formal Malay for "Content size exceeds limit"
        size: contentSize,
      }, { status: 413 });
    }
    // End: Payload Validation

    // Start: Content Sanitization Integration
    let sanitizedContent = content;
    const contentType = getContentTypeForSanitization(mimeType || getFileTypeFromFilename(fileName)); // Start: Use helper to detect if mimeType is not provided
    
    if (contentType !== 'unknown') {
      try {
        const sanitizationResult = contentType === 'html'
          ? sanitizeHtmlPayload(content || '').sanitized
          : contentType === 'css'
          ? sanitizeCssPayload(content || '')
          : sanitizeJsPayload(content || '');
        sanitizedContent = sanitizationResult;
      } catch (sanitizeError) {
        console.error('Sanitization error:', sanitizeError);
        return NextResponse.json({
          success: false,
          error: sanitizeError instanceof Error ? sanitizeError.message : 'Kandungan tidak selamat', // Formal Malay for "Unsafe content"
          size: contentSize,
        }, { status: 400 });
      }
    }
    // End: Content Sanitization Integration

    // Sanitize filename
    const sanitizedFileName = sanitizeFileName(fileName);
    const fileKey = `${userId}/${sanitizedFileName}`;

    // Start: R2 Text Content Upload Logic
    try {
      // Placeholder for actual R2 implementation
      // const r2Client = new S3Client({ ... });
      console.log(`Mock R2 PUT upload for file: ${fileKey}, size: ${contentSize}`);
      // await r2Client.send(command);
    } catch (r2Error) {
      console.error('R2 text upload error:', r2Error);
      return NextResponse.json({ success: false, error: 'Gagal mengemas kini kandungan fail ke simpanan', size: contentSize }, { status: 500 }); // Formal Malay for "Failed to update file content to storage"
    }
    // End: R2 Text Content Upload Logic

    const uploadResponse: UploadResponse = {
      success: true,
      url: `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${fileKey}`,
      key: fileKey,
      size: contentSize,
    };

    return NextResponse.json(uploadResponse, { status: 200 });

  } catch (error) {
    console.error("Error processing text upload:", error);
    
    return NextResponse.json({
      success: false,
      error: "Gagal mengemas kini kandungan fail", // Formal Malay for "Failed to update file content"
      size: 0,
    }, { status: 500 });
  }
}
// End: PUT Handler for Text Content Upload

// Start: GET Handler for Upload Limits
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    return NextResponse.json({
      success: true,
      maxSize: MAX_FILE_SIZE,
      maxTextSize: MAX_TEXT_SIZE,
      allowedTypes: ALLOWED_MIME_TYPES,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Gagal mendapatkan tetapan muat naik", // Formal Malay for "Failed to get upload settings"
    }, { status: 500 });
  }
}
// End: GET Handler for Upload Limits

// Start: File Validation Function
const validateFile = async (file: File): Promise<FileValidation> => {
  const size = file.size;
  const mimeType = file.type;

  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Saiz fail melebihi had ${MAX_FILE_SIZE / 1024 / 1024}MB (${(size / 1024 / 1024).toFixed(2)}MB)`, // Formal Malay for "File size exceeds limit"
      size,
      mimeType,
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Jenis fail ${mimeType} tidak dibenarkan`, // Formal Malay for "File type not allowed"
      size,
      mimeType,
    };
  }

  if (size === 0) {
    return {
      valid: false,
      error: "Fail tidak sah (saiz sifar)", // Formal Malay for "Invalid file (zero size)"
      size,
      mimeType,
    };
  }

  return {
    valid: true,
    size,
    mimeType,
  };
};
// End: File Validation Function

// Note: content variable reference for POST handler
let content = '';