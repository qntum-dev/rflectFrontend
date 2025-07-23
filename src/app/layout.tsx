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
    // url:
    type: "website",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/icons/navlogo.png`],
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
