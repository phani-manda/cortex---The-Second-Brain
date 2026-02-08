import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { SessionProvider } from "@/components/session-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cortex – AI Second Brain",
  description:
    "A beautifully intelligent knowledge management system that captures, organizes, and retrieves thoughts using AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${fontVariables} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
