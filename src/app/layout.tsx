import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";

interface IRootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "SwiftBlocs App",
  description: "My SwiftBlocs Application",
};

export default function RootLayout({ children }: IRootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
