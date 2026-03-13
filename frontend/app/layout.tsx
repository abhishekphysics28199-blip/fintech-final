import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fintech.AI — Your All-Time Friend to Help You",
  description: "India-first financial safety assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-b from-navy to-[#050B16]">
          {children}
        </div>
      </body>
    </html>
  );
}

