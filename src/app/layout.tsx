import type { Metadata } from "next";
import "./globals.css";

interface IRootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "SwiftBlocs App",
  description: "My SwiftBlocs Application",
};

export default function RootLayout({ children }: IRootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
