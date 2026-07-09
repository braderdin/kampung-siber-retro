import type { Metadata } from "next";
import { Geist, Geist_Mono, VT323 } from "next/font/google";
import "./globals.css";
import "../styles/retro.css";
import RetroNavbar from "@/components/RetroNavbar";
import RetroFooter from "@/components/RetroFooter";
import KeyboardShortcutOverlay from "@/components/KeyboardShortcutOverlay";
import PageTransitionOverlay from "@/components/PageTransitionOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kampung Siber Retro Workspace",
  description: "Enterprise-grade modular retro workspace platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable} h-full antialiased`}
    >
      {/* Start: Inline Pre-Hydration Theme Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                if (localStorage.getItem('retro-crt-enabled') === 'true') {
                  document.documentElement.classList.add('crt-enabled');
                }
              } catch (e) {}
            })();
          `,
        }}
      />
      {/* End: Inline Pre-Hydration Theme Script */}
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black font-sans">
        <RetroNavbar />
        <main className="flex-1">
          <PageTransitionOverlay>
            {children}
          </PageTransitionOverlay>
        </main>
        <RetroFooter />
        <KeyboardShortcutOverlay />
      </body>
    </html>
  );
}