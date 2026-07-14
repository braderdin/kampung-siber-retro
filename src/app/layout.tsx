// Start: Root Layout mounting Global Retro Navigation + Footer (Next.js 15 App Router)
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/retro.css";
import RetroNavbar from "@/components/RetroNavbar";
import RetroFooter from "@/components/RetroFooter";
import FloatingAiAssistant from "@/components/FloatingAiAssistant";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://kampung-siber.retro"),
  title: {
    default: "Kampung Siber Retro",
    template: "%s · Kampung Siber Retro",
  },
  description:
    "Platform komuniti retro dengan Cloudflare R2 storage integration. Arkib digital, arcade, dan pusat warga siber kampung.",
  applicationName: "Kampung Siber Retro",
  keywords: [
    "kampung siber",
    "retro",
    "arcade",
    "muzium siber",
    "komuniti",
    "neocities",
  ],
  authors: [{ name: "Pasukan Kampung Siber" }],
  creator: "Kampung Siber",
  publisher: "Kampung Siber",
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  openGraph: {
    title: "Kampung Siber Retro",
    description:
      "Platform komuniti retro dengan Cloudflare R2 storage integration.",
    url: "https://kampung-siber.retro",
    siteName: "Kampung Siber Retro",
    locale: "ms_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kampung Siber Retro",
    description:
      "Platform komuniti retro dengan Cloudflare R2 storage integration.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

// Start: Strategy 1 — Zero-Flash Theme Persistence (Anti-FOUC)
// Reads the server-readable theme cookie BEFORE hydration so the correct
// data-theme + dark class is painted immediately — no white flash.
const THEME_COOKIE = "kampung-siber-theme-cookie";
const DARK_THEMES = new Set(["space-neon", "retro-matrix"]);

async function resolveTheme() {
  const store = await cookies();
  const theme = store.get(THEME_COOKIE)?.value ?? "space-neon";
  const dataTheme = ["space-neon", "windows-gray", "retro-matrix"].includes(theme)
    ? theme
    : "space-neon";
  const isDark = DARK_THEMES.has(dataTheme);
  return { dataTheme, isDark };
}
// End: Strategy 1 — Zero-Flash Theme Persistence

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { dataTheme, isDark } = await resolveTheme();

  return (
    <html
      lang="en"
      data-theme={dataTheme}
      className={isDark ? "dark" : undefined}
      suppressHydrationWarning
    >
      <head>
        {/* Start: Theme Hydration Safety Net (cookie-backed, no localStorage FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)kampung-siber-theme-cookie=([^;]*)/);var id=m?decodeURIComponent(m[1]):'space-neon';document.documentElement.dataset.theme=id;var dark=(id==='space-neon'||id==='retro-matrix');document.documentElement.classList.toggle('dark',dark);}catch(e){document.documentElement.dataset.theme='space-neon';}})();`,
          }}
        />
        {/* End: Theme Hydration Safety Net */}
      </head>
      {/* Start: Application Shell with Mounted Navbar + Footer */}
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        <RetroNavbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <RetroFooter />
        {/* Start: Authenticated KawanSiber Floating AI Assistant (Phase 3) */}
        <FloatingAiAssistant />
        {/* End: Authenticated KawanSiber Floating AI Assistant */}
      </body>
      {/* End: Application Shell with Mounted Navbar + Footer */}
    </html>
  );
}
// End: Root Layout mounting Global Retro Navigation + Footer
