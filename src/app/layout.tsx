import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { generateSiteMetadata } from "./lib/metadata";
import { generateOrganizationSchema, generateWebsiteSchema } from "./lib/structuredData";
import { StructuredData } from "./components/StructuredData";
import { PerformanceMonitor } from "./components/PerformanceMonitor";
import { ServiceWorkerRegister } from "./components/ServiceWorkerRegister";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = generateSiteMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en">
      <head>
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <PerformanceMonitor />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
