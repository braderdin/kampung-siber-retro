// Start: Cloudflare R2 Storage Read Handler with Exact Malay Error Handling
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

// Start: File Content Response Interface
interface FileContentResponse {
  success: boolean;
  content?: string;
  filename?: string;
  size?: number;
  error?: string;
  errorCode?: number;
}
// End: File Content Response Interface

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
    return { authenticated: false };
  }
}
// End: Session Authentication Helper

// Start: GET Handler for Reading R2 Files with Proper HTTP Status Codes
export async function GET(req: NextRequest): Promise<NextResponse<FileContentResponse>> {
  // Start: Authentication Check with Proper HTTP 401
  const { authenticated, userId } = await authenticateSession(req);
  
  if (!authenticated) {
    return NextResponse.json({
      success: false,
      error: 'Pengesahan diperlukan untuk mengakses simpanan', // Formal Malay for "Authentication required to access storage"
      errorCode: 401,
    }, { status: 401 });
  }
  // End: Authentication Check

  // Get filename parameter
  const url = new URL(req.url);
  const filename = url.searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({
      success: false,
      error: 'Parameter fail (filename) diperlukan', // Formal Malay for "File parameter (filename) is required"
      errorCode: 400,
    }, { status: 400 });
  }

  // Sanitize filename to prevent path traversal
  const sanitizedFilename = filename
    .replace(/\.{2,}/g, '')
    .replace(/[^a-zA-Z0-9._\-/]/g, '')
    .replace(/^\//, '');

  if (!sanitizedFilename) {
    return NextResponse.json({
      success: false,
      error: 'Nama fail tidak sah', // Formal Malay for "Invalid file name"
      errorCode: 400,
    }, { status: 400 });
  }

  // Construct user-specific file key
  const fileKey = `${userId}/${sanitizedFilename}`;

  // Start: R2 File Fetch Logic (Mock Implementation)
  let fileContent = '';
  let fileSize = 0;

  try {
    // Placeholder for actual R2 implementation
    // Abangku, this is where the actual R2 fetch logic would go.
    if (sanitizedFilename === 'index.html') {
      fileContent = `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Saya</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      background: #1a1a2e;
      color: #eaeaea;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      color: #00ff88;
      text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Selamat Datang ke Teratak Saya!</h1>
        <p>Halaman ini mempunyai kandungan dari Cloudflare R2.</p>
  </div>
</body>
</html>`;
      fileSize = fileContent.length;
    } else if (sanitizedFilename === 'style.css') { // Start: Mock content for CSS
      fileContent = `body { background-color: #282c34; color: #abb2bf; }`;
      fileSize = fileContent.length;
    } else if (sanitizedFilename === 'script.js') { // Start: Mock content for JS
      fileContent = `console.log('Hello from R2 script!');`;
      fileSize = fileContent.length;
    }
  } catch (r2Error) {
    console.error('R2 fetch error:', r2Error);
    fileContent = '';
    fileSize = 0;
  }
  // End: R2 File Fetch Logic

  // Start: File Not Found Handling with HTTP 404
  if (!fileContent) {
    return NextResponse.json({
      success: false,
      error: 'Fail tidak dijumpai dalam simpanan', // Formal Malay for "File not found in storage"
      errorCode: 404,
    }, { status: 404 });
  }
  // End: File Not Found Handling

  return NextResponse.json({
    success: true,
    content: fileContent,
    filename: sanitizedFilename,
    size: fileSize
  }, { status: 200 });
}
// End: GET Handler for Reading R2 Files

// Start: POST Handler for Reading R2 Files (Alternative)
export async function POST(req: NextRequest): Promise<NextResponse<FileContentResponse>> {
  try {
    const { authenticated, userId } = await authenticateSession(req);
    
    if (!authenticated) {
      return NextResponse.json({
        success: false,
        error: 'Pengesahan diperlukan untuk mengakses simpanan', // Formal Malay for "Authentication required to access storage"
        errorCode: 401,
      }, { status: 401 });
    }

    const body = await req.json();
    const { filename } = body;

    if (!filename) {
      return NextResponse.json({
        success: false,
        error: 'Nama fail diperlukan', // Formal Malay for "File name is required"
        errorCode: 400,
      }, { status: 400 });
    }

    const sanitizedFilename = filename
      .replace(/\.{2,}/g, '')
      .replace(/[^a-zA-Z0-9._\-/]/g, '')
      .replace(/^\//, '');

      // Return mock content
    const fileContent = `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${sanitizedFilename}</title>
</head>
<body>
  <h1>Kandungan ${sanitizedFilename}</h1>
</body>
</html>`;

    return NextResponse.json({
      success: true,
      content: fileContent,
      filename: sanitizedFilename,
      size: fileContent.length
    }, { status: 200 });

  } catch (error) {
    console.error('Storage read POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Gagal membaca fail', // Formal Malay for "Failed to read file"
      errorCode: 500,
    }, { status: 500 });
  }
}
// End: POST Handler for Reading R2 Files