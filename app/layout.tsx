import type { Metadata } from "next";
import { AppShell } from "@/components/navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoTrack AI - Smart Energy Dashboard",
  description: "IoT smart home energy monitoring and automation dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
