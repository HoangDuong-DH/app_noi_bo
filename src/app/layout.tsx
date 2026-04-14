import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SA MVP",
  description: "Internal SA queue MVP"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
