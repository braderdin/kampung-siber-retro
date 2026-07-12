// Start: Root Layout with Provider Optimizations for Next.js 15 App Router
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kampung Siber Retro",
  description: "Platform komuniti retro dengan Cloudflare R2 storage integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Start: Main Application Wrapper */}
        <div className="min-h-screen bg-background text-foreground antialiased">
          {children}
        </div>
        {/* End: Main Application Wrapper */}
      </body>
    </html>
  );
}
// End: Root Layout with Provider Optimizations