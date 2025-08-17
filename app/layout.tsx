import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/src/providers/QueryProvider";
import { Header } from "@/src/components/layout/Header.component";
import { Footer } from "@/src/components/layout/Footer.component";
import { APP_CONFIG } from "@/src/constants/app.constants";

export const metadata: Metadata = {
  metadataBase: new URL(APP_CONFIG.url),
  title: {
    default: APP_CONFIG.name,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  keywords: ["chartered accountant", "CA", "tax filing", "GST", "audit", "financial services", "accounting", "India"],
  authors: [{ name: APP_CONFIG.name }],
  creator: APP_CONFIG.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_CONFIG.url,
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    siteName: APP_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
  },
  robots: (() => {
    const isProd = APP_CONFIG.url.includes("auditit.in");
    return {
      index: isProd,
      follow: isProd,
      nocache: !isProd,
      googleBot: {
        index: isProd,
        follow: isProd,
        noimageindex: !isProd,
      },
    } as const;
  })(),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='min-h-screen bg-background font-sans antialiased' suppressHydrationWarning>
        <QueryProvider>
          <div className='flex min-h-screen flex-col'>
            <Header />
            <main role='main' className='flex-1'>
              {children}
            </main>
            <Footer />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
