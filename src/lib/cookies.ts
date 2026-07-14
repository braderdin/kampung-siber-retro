// Start: Kampung Siber Cookie State Engine (Rule 31 + Anti-FOUC + Zero-DB Drafts)
// Lightweight, dependency-free cookie helpers used across client components to
// persist non-sensitive UI/theme/filter state without bloating the Supabase DB.

const isBrowser = typeof window !== "undefined";

export interface CookieOptions {
  maxAge?: number; // seconds
  path?: string;
  sameSite?: "strict" | "lax" | "none";
  secure?: boolean;
}

// Start: Encode/decode safe wrappers
const encodeValue = (value: string): string => encodeURIComponent(value);
const decodeValue = (value: string): string => decodeURIComponent(value);
// End: Encode/decode safe wrappers

// Start: Core cookie writers
export function setCookie(name: string, value: string, opts: CookieOptions = {}): void {
  if (!isBrowser) return;
  const path = opts.path ?? "/";
  const maxAge = opts.maxAge ?? 60 * 60 * 24 * 7; // default 7 days
  const sameSite = opts.sameSite ?? "lax";
  const secure = opts.secure ?? window.location.protocol === "https:";
  let cookie = `${name}=${encodeValue(value)}; path=${path}; max-age=${maxAge}; samesite=${sameSite}`;
  if (secure) cookie += "; secure";
  document.cookie = cookie;
}
// End: Core cookie writers

// Start: Core cookie readers
export function getCookie(name: string): string | null {
  if (!isBrowser) return null;
  const matches = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
  return matches ? decodeValue(matches[2]) : null;
}
// End: Core cookie readers

// Start: Core cookie removers
export function removeCookie(name: string, path = "/"): void {
  if (!isBrowser) return;
  document.cookie = `${name}=; path=${path}; max-age=0; samesite=lax`;
}
// End: Core cookie removers

// Start: Typed JSON cookie helpers (used for filter arrays + sidebar config)
export function setJsonCookie<T>(name: string, value: T, opts?: CookieOptions): void {
  try {
    setCookie(name, JSON.stringify(value), opts);
  } catch {
    /* serialization failure — ignore silently */
  }
}

export function getJsonCookie<T>(name: string, fallback: T): T {
  const raw = getCookie(name);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
// End: Typed JSON cookie helpers

// Start: Kampung Siber Cookie Namespace Constants
export const COOKIE_KEYS = {
  THEME: "kampung-siber-theme-cookie",
  SIDEBAR: "kampung-siber-sidebar-state",
  EDITOR_DRAFT: "kampung-siber-editor-draft",
  BLOCKED_TAGS: "siber_blocked_tags",
} as const;
// End: Kampung Siber Cookie Namespace Constants

// Start: 7-day parity constant (seconds) shared with Supabase session TTL
export const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60; // 604,800
// End: 7-day parity constant
// End: Kampung Siber Cookie State Engine