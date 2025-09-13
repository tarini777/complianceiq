import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import { SystemConfigProvider } from "@/contexts/SystemConfigContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ComplianceIQ - Pharmaceutical AI Readiness Assessment",
  description: "Professional pharmaceutical AI compliance assessment platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <SystemConfigProvider>
          <Layout>
            {children}
          </Layout>
        </SystemConfigProvider>
      </body>
    </html>
  );
}
