import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Atoms Demo",
  description: "Multi-agent AI app builder demo with streaming previews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${displayFont.variable} ${monoFont.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          richColors
          expand
          toastOptions={{
            className: "border border-white/10 bg-slate-950/90 text-slate-100",
          }}
        />
      </body>
    </html>
  );
}
