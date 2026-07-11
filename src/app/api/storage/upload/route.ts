import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
  "application/json",
];

interface UploadRequest {
  file: File;
  fileName: string;
  mimeType: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

interface UploadResponse {
  success: boolean;
  url?: string;
  key?: string;
  size: number;
  error?: string;
}

interface FileValidation {
  valid: boolean;
  error?: string;
  size: number;
  mimeType: string;
}

const validateFile = async (file: File): Promise<FileValidation> => {
  const size = file.size;
  const mimeType = file.type;

  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Saiz fail melebihi had 4.5MB (${(size / 1024 / 1024).toFixed(2)}MB)`,
      size,
      mimeType,
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Jenis fail ${mimeType} tidak dibenarkan`,
      size,
      mimeType,
    };
  }

  if (size === 0) {
    return {
      valid: false,
      error: "Fail tidak sah (saiz sifar)",
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

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .replace(/^(\.)|(\.)$/g, "")
    .substring(0, 255);
};

export async function POST(req: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId")?.toString() || "anonymous";
    const metadata = formData.get("metadata") ? 
      JSON.parse(formData.get("metadata") as string) : {};

    if (!file) {
      return NextResponse.json({
        success: false,
        error: "Tiada fail yang diserakan",
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

    const sanitizedFileName = sanitizeFileName(file.name);
    const timestamp = Date.now();
    const fileKey = `uploads/${userId}/${timestamp}_${sanitizedFileName}`;

    const uploadResponse: UploadResponse = {
      success: true,
      url: `https://storage.example.com/${fileKey}`,
      key: fileKey,
      size: validation.size,
    };

    return NextResponse.json(uploadResponse, { status: 200 });

  } catch (error) {
    console.error("Error processing upload:", error);
    
    return NextResponse.json({
      success: false,
      error: "Gagal memproses unggahan",
      size: 0,
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest): Promise<NextResponse<{ success: boolean; maxSize?: number; allowedTypes?: string[] }>> {
  try {
    return NextResponse.json({
      success: true,
      maxSize: MAX_FILE_SIZE,
      allowedTypes: ALLOWED_MIME_TYPES,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Gagal mendapatkan ayat unggahan",
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const body = await req.json();
    
    const { fileSize, fileName, userId }: { fileSize?: number; fileName?: string; userId?: string } = body;

    if (!fileSize && !fileName) {
      return NextResponse.json({
        success: false,
        error: "Saiz fail dan nama fail diperlukan untuk validasi",
        size: 0,
      }, { status: 400 });
    }

    if (fileSize !== undefined && fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({
        success: false,
        error: `Saiz fail ${fileSize} melebihi had 4.5MB`,
        size: fileSize,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      url: `https://storage.example.com/validation/${userId || "anonymous"}`,
      key: `validation/${userId || "anonymous"}`,
      size: fileSize || 0,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Gagal memproses validasi",
      size: 0,
    }, { status: 500 });
  }
}

// Note: api.bodyParser config removed - Next.js App Router ignores this export
// File size validation is handled in POST handler above