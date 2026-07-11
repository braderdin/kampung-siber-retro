// Start: HTML Payload Sanitizer Utility for R2 Storage Operations
import DOMPurify from 'dompurify';

// Start: Sanitization Configuration
interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  maxLength?: number;
}
// End: Sanitization Configuration

// Start: Default Allowed Tags
const DEFAULT_ALLOWED_TAGS = [
  'html', 'head', 'body', 'title', 'meta', 'link', 'style', 'script',
  'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'a', 'img', 'video', 'audio', 'source', 'track',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'form', 'input', 'textarea', 'button', 'label', 'select', 'option',
  'iframe', 'br', 'hr', 'strong', 'em', 'b', 'i', 'u',
  'section', 'article', 'header', 'footer', 'nav', 'main',
  'canvas', 'svg', 'path', 'circle', 'rect', 'line', 'g',
];
// End: Default Allowed Tags

// Start: Default Allowed Attributes
const DEFAULT_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  '*': ['class', 'id', 'style'],
  'a': ['href', 'title', 'target', 'rel'],
  'img': ['src', 'alt', 'width', 'height'],
  'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow', 'loading'],
  'meta': ['charset', 'name', 'content', 'viewport'],
  'link': ['rel', 'href', 'type'],
  'script': ['src', 'type', 'async', 'defer'],
  'div': ['data-*'],
  'span': ['data-*'],
};
// End: Default Allowed Attributes

// Start: Sanitize HTML Function
export function sanitizeHtmlPayload(
  htmlContent: string,
  options: SanitizeOptions = {}
): { sanitized: string; removedTags: string[]; originalLength: number; sanitizedLength: number } {
  const {
    allowedTags = DEFAULT_ALLOWED_TAGS,
    allowedAttributes = DEFAULT_ALLOWED_ATTRIBUTES,
    maxLength = 500 * 1024, // 500KB default
  } = options;

  // Start: Length Validation
  const originalLength = htmlContent.length;
  
  if (originalLength > maxLength) {
    throw new Error(`Kandungan HTML melebihi had ${maxLength / 1024}KB`);
  }
  // End: Length Validation

  // Start: DOMPurify Configuration
  const config: DOMPurify.Config = {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: Object.values(allowedAttributes).flat(),
    ADD_ATTR: ['target', 'rel'],
  };
  // End: DOMPurify Configuration

  // Start: Sanitize HTML Content
  let sanitized = DOMPurify.sanitize(htmlContent, config);
  // End: Sanitize HTML Content

  // Start: Additional Security Processing
  // Remove dangerous JavaScript protocol handlers
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove dangerous event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove script tags with inline content (security hardening)
  sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '<!---->').trim();
  // End: Additional Security Processing

  // Track removed tags for diagnostics
  const removedTags: string[] = [];
  const originalTagCount = (htmlContent.match(/<[^>]+>/g) || []).length;
  const sanitizedTagCount = (sanitized.match(/<[^>]+>/g) || []).length;
  
  if (originalTagCount > sanitizedTagCount) {
    removedTags.push(`Removed ${originalTagCount - sanitizedTagCount} disallowed tags`);
  }

  return {
    sanitized,
    removedTags,
    originalLength,
    sanitizedLength: sanitized.length,
  };
}
// End: Sanitize HTML Function

// Start: Validate HTML Structure Function
export function validateHtmlStructure(htmlContent: string): { valid: boolean; error?: string } {
  // Start: Basic HTML Validation
  if (!htmlContent || htmlContent.trim() === '') {
    return { valid: true }; // Empty content is valid for new files
  }

  // Check for basic HTML structure integrity
  const hasHtmlOpening = /<html[^>]*>/i.test(htmlContent);
  const hasHtmlClosing = /<\/html>/i.test(htmlContent);
  
  // Valid HTML should have both or neither (template)
  if (hasHtmlOpening !== hasHtmlClosing) {
    return {
      valid: false,
      error: 'Struktur HTML tidak sepenuhnya - pastikan tag pembuka dan penutup sepadan',
    };
  }

  // Start: Security Pattern Detection
  const dangerousPatterns = [
    /<script[^>]*>window\.location/i,
    /document\.cookie/i,
    /localStorage\.setItem/i,
    /sessionStorage\.setItem/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(htmlContent)) {
      return {
        valid: false,
        error: 'Kandungan tidak selamat - elem yang dilarang terdeteksi',
      };
    }
  }
  // End: Security Pattern Detection

  return { valid: true };
}
// End: Validate HTML Structure Function

// Start: Sanitize CSS Function
export function sanitizeCssPayload(cssContent: string, maxLength: number = 100 * 1024): string {
  // Length validation
  if (cssContent.length > maxLength) {
    throw new Error(`Kandungan CSS melebihi had ${maxLength / 1024}KB`);
  }

  // Remove dangerous patterns
  let sanitized = cssContent
    .replace(/javascript:/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/behavior\s*:/gi, '')
    .replace(/-moz-binding\s*:/gi, '');

  // Remove url() with dangerous protocols
  sanitized = sanitized.replace(/url\s*\(\s*['"]?javascript:/gi, "url('data:text/html,')");

  return sanitized;
}
// End: Sanitize CSS Function

// Start: Sanitize JavaScript Function
export function sanitizeJsPayload(jsContent: string, maxLength: number = 100 * 1024): string {
  // Length validation
  if (jsContent.length > maxLength) {
    throw new Error(`Kandungan JavaScript melebihi had ${maxLength / 1024}KB`);
  }

  // Basic sanitization - in production use proper JS parser
  // This is a lightweight check for dangerous patterns
  const dangerousPatterns = [
    'eval(',
    'document.cookie',
    'localStorage.setItem("',
    'sessionStorage.setItem("',
  ];

  let sanitized = jsContent;
  for (const pattern of dangerousPatterns) {
    if (sanitized.includes(pattern)) {
      sanitized = sanitized.replace(pattern, '/* removed */');
    }
  }

  return sanitized;
}
// End: Sanitize JavaScript Function

// Start: Get File Type from Filename
export function getFileTypeFromFilename(filename: string): 'html' | 'css' | 'javascript' | 'unknown' {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  switch (ext) {
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'js':
      return 'javascript';
    default:
      return 'unknown';
  }
}
// End: Get File Type from Filename