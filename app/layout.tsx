import type { Metadata } from "next";
import { Navigation, Sidebar } from "@/components/navigation";
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
        <Navigation />
        <Sidebar />
        <main className="lg:ml-64 pt-16 transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
