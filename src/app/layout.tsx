// Start: Root Layout with Provider Optimizations for Next.js 15 App Router
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

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
        {/* Start: Global Theme Provider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Start: Main Application Wrapper */}
          <div className="min-h-screen bg-background text-foreground antialiased">
            {children}
          </div>
          {/* End: Main Application Wrapper */}
          
          {/* Start: Global Toast Notifications */}
          <Toaster />
          {/* End: Global Toast Notifications */}
        </ThemeProvider>
        {/* End: Global Theme Provider */}
      </body>
    </html>
  );
}
// End: Root Layout with Provider Optimizations