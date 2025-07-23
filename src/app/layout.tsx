import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rflect: A Simple chat app",
  description:
    "Developed By Pritam Mondal",

  icons: {
    icon: ["/icons/favicon-96x96.png"],
    apple: ["/icons/apple-touch-icon.png"],
    shortcut: ["/icons/apple-touch-icon.png"],
  },
  openGraph: {
    title: 'Rflect: A Simple chat app',
    description: 'Developed By Pritam Mondal',
    url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    siteName: 'Rflect',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-logo.png`, // Absolute URL is important for social media
        width: 1200,
        height: 630,
        alt: 'Rflect Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>

          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}


          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
