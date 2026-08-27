import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ServiceWorkerRegister from "@/components/service-worker-register";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const inter = Inter({ subsets: ["latin"] });

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Core",
  description: "This is my personal website stay away.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Core",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "font-sans",
        ibmPlexSans.variable,
        playfairDisplay.variable,
      )}
    >
      <body className={inter.className}>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
