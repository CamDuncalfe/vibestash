import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VibeStash — Discover the best vibe-coded apps & products",
  description:
    "A curated gallery of the best vibe-coded apps and products. Discover software built with AI tools like Cursor, v0, Bolt, Lovable, and Claude.",
  keywords: ["vibe coding", "AI tools", "Cursor", "v0", "Bolt", "Lovable", "Claude", "software gallery", "vibe-coded", "AI apps"],
  metadataBase: new URL("https://vibestash.fun"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vibestash.fun",
    siteName: "VibeStash",
    title: "VibeStash — Discover the best vibe-coded apps & products",
    description: "A curated gallery of the best vibe-coded apps and products. Discover software built with AI tools like Cursor, v0, Bolt, Lovable, and Claude.",
    images: [
      {
        url: "/api/og?title=Discover+the+best+vibe-coded+apps&desc=A+curated+gallery+of+apps+built+with+Cursor,+v0,+Bolt,+Lovable,+and+Claude",
        width: 1200,
        height: 630,
        alt: "VibeStash — The best vibe-coded apps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vibestashfun",
    creator: "@vibestashfun",
    title: "VibeStash — Discover the best vibe-coded apps & products",
    description: "A curated gallery of the best vibe-coded apps and products built with AI tools.",
    images: ["/api/og?title=Discover+the+best+vibe-coded+apps&desc=A+curated+gallery+of+apps+built+with+Cursor,+v0,+Bolt,+Lovable,+and+Claude"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://vibestash.fun",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('vibestash-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased bg-white dark:bg-[#0a0a0a] text-[#1a1a1a] dark:text-mbogray-200 transition-colors">
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
