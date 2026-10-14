import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import "./lovable-theme.css";
import "./console.css";

const ibmSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-sans",
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "IT Staffing Solutions | Cloud, Data & Emerging Tech Experts | Technograph",
  description:
    "Discover future-ready IT talent with Technograph. From cloud to big data and digital transformation, we help you build smarter teams that drive growth and innovation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ibmSans.variable} ${ibmMono.variable} font-sans antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
