import type { Metadata } from "next";
import { AppShell } from "@/components/navigation";
import { DataSyncProvider } from "@/components/providers/DataSyncProvider";
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
        <DataSyncProvider>
          <AppShell>{children}</AppShell>
        </DataSyncProvider>
      </body>
    </html>
  );
}
