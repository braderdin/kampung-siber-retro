// Start: Tier-3 Genuine Preview Route Handler (Cloudflare R2 Live Render)
// GET /api/editor/preview?site=<objectKey|sitePrefix>
// Fetches published HTML/CSS/JS assets directly from the Cloudflare R2 bucket
// (`kampung-siber-assets`) and streams a fully-compiled, self-contained
// text/html document back into the browser frame so it renders natively
// instead of displaying a raw path pattern.
import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// Start: R2 Environment Configuration Boundary (mirrors editor/deploy route)
const CLOUDFLARE_R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID || "";
const CLOUDFLARE_R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "";
const CLOUDFLARE_R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "";
const CLOUDFLARE_R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "kampung-siber-assets";
// End: R2 Environment Configuration Boundary

// Start: S3 Client Configuration (R2 S3-Compatible Endpoint)
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});
// End: S3 Client Configuration

// Start: Path Traversal Sanitizer (deny ../, absolute roots, and non-alnum paths)
function sanitizeObjectKey(raw: string): string | null {
  if (!raw || typeof raw !== "string") return null;
  // Decode once to neutralize encoded traversal attempts, then strip.
  const decoded = decodeURIComponent(raw);
  const stripped = decoded
    .replace(/\.{2,}/g, "")
    .replace(/[^a-zA-Z0-9._/-]/g, "")
    .replace(/^\/+/, "")
    .replace(/\/+/g, "/");
  if (!stripped || stripped.length > 512) return null;
  // Final safety net: refuse any residual traversal token.
  if (stripped.includes("..")) return null;
  return stripped;
}
// End: Path Traversal Sanitizer

// Start: R2 Object Reader (returns raw string body or throws)
async function readR2Object(objectKey: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: CLOUDFLARE_R2_BUCKET_NAME,
    Key: objectKey,
  });
  const response = await s3Client.send(command);
  if (!response.Body) {
    throw new Error(`Objek kosong: ${objectKey}`);
  }
  // transformToString streams + decodes the S3 body natively.
  return await response.Body.transformToString("utf-8");
}
// End: R2 Object Reader

// Start: Single-Object Stream Handler (for explicit .html/.htm keys)
async function streamSingleHtml(objectKey: string): Promise<string> {
  return await readR2Object(objectKey);
}
// End: Single-Object Stream Handler

// Start: Multi-Asset Compile Handler (for directory prefixes -> self-contained doc)
async function compileSiteBundle(sitePrefix: string): Promise<string> {
  const base = sitePrefix.replace(/\/$/, "");
  const indexKey = `${base}/index.html`;
  let html = "";
  try {
    html = await readR2Object(indexKey);
  } catch {
    throw new Error(`index.html tidak dijumpai di "${base}"`);
  }

  // Fetch optional linked assets; tolerate missing css/js gracefully.
  let css = "";
  let js = "";
  try {
    css = await readR2Object(`${base}/styles.css`);
  } catch {
    css = "";
  }
  try {
    js = await readR2Object(`${base}/script.js`);
  } catch {
    js = "";
  }

  // Start: Async Inline of external <link rel=stylesheet> references
  // String.replace callbacks run synchronously, so we resolve every asset
  // promise up-front, then perform the substitution with fully-resolved values.
  const cssLinkRegex = /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  const cssMatches: { match: string; href: string; content: string }[] = [];
  let cssMatch: RegExpExecArray | null;
  while ((cssMatch = cssLinkRegex.exec(html)) !== null) {
    const href = cssMatch[1];
    let content = cssMatch[0]; // default: leave untouched
    if (!href.startsWith("http") && !href.startsWith("//") && !href.startsWith("data:")) {
      const assetKey = `${base}/${href.replace(/^\/+/, "")}`;
      try {
        content = `<style data-inlined="${href}">\n${await readR2Object(assetKey)}\n</style>`;
      } catch {
        content = cssMatch[0]; // leave unresolvable links as-is
      }
    }
    cssMatches.push({ match: cssMatch[0], href, content });
  }
  for (const entry of cssMatches) {
    html = html.split(entry.match).join(entry.content);
  }
  // End: Async Inline of stylesheet references

  // Start: Async Inline of external <script src> references
  const jsSrcRegex = /<script[^>]+src=["']([^"']+)["'][^>]*><\/script>/gi;
  const jsMatches: { match: string; src: string; content: string }[] = [];
  let jsMatch: RegExpExecArray | null;
  while ((jsMatch = jsSrcRegex.exec(html)) !== null) {
    const src = jsMatch[1];
    let content = jsMatch[0]; // default: leave untouched
    if (!src.startsWith("http") && !src.startsWith("//") && !src.startsWith("data:")) {
      const assetKey = `${base}/${src.replace(/^\/+/, "")}`;
      try {
        content = `<script data-inlined="${src}">\n${await readR2Object(assetKey)}\n</script>`;
      } catch {
        content = jsMatch[0]; // leave unresolvable links as-is
      }
    }
    jsMatches.push({ match: jsMatch[0], src, content });
  }
  for (const entry of jsMatches) {
    html = html.split(entry.match).join(entry.content);
  }
  // End: Async Inline of script references

  // Inject compiled inline <style> and <script> if dedicated asset files exist.
  if (css) {
    html = html.replace(/<\/head>/i, `<style data-compiled="styles.css">\n${css}\n</style>\n</head>`);
  }
  if (js) {
    html = html.replace(/<\/body>/i, `<script data-compiled="script.js">\n${js}\n</script>\n</body>`);
  }

  return html;
}
// End: Multi-Asset Compile Handler

// Start: Native HTML Error Page (genuine failure state, not a fake placeholder)
function buildErrorHtml(status: number, title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
       background:#060814;color:#e6f7ff;font-family:'Courier New',monospace;}
  .card{border:1px solid #00ffff55;border-radius:14px;padding:28px 34px;max-width:520px;
        text-align:center;box-shadow:0 0 40px #00ffff33;}
  h1{color:#ff007f;text-shadow:0 0 12px #ff007f88;margin:0 0 10px;font-size:20px;}
  p{color:#7fe9ff;font-size:13px;line-height:1.6;margin:0;}
  .code{display:inline-block;margin-top:14px;padding:4px 12px;border:1px solid #aaff0055;
        color:#aaff00;border-radius:8px;font-size:12px;}
</style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <span class="code">STATUS ${status}</span>
  </div>
</body>
</html>`;
}
// End: Native HTML Error Page

// Start: GET Handler - Resolve & Stream Preview Document
export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const rawSite = url.searchParams.get("site");

  const objectKey = sanitizeObjectKey(rawSite || "");
  if (!objectKey) {
    return new NextResponse(
      buildErrorHtml(400, "Parameter Tidak Sah", "Parameter 'site' diperlukan dan mestilah kunci objek R2 yang sah."),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  // Credential guard: without R2 secrets the route cannot resolve assets natively.
  if (!CLOUDFLARE_R2_ACCOUNT_ID || !CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
    return new NextResponse(
      buildErrorHtml(500, "Pratonton Tidak Tersedia", "Kredential Cloudflare R2 belum dikonfigurasikan pada pelayan. Sila tetapkan pemboleh ubah persekitaran R2."),
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  try {
    const isExplicitHtml = /\.html?$/i.test(objectKey);
    const html = isExplicitHtml
      ? await streamSingleHtml(objectKey)
      : await compileSiteBundle(objectKey);

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ralat tidak diketahui semasa mengambil aset.";
    console.error("Editor Preview API Error:", error);
    return new NextResponse(
      buildErrorHtml(404, "Pratonton Tidak Dijumpai", `Gagal mengambil aset dari R2: ${message}`),
      { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }
}
// End: GET Handler