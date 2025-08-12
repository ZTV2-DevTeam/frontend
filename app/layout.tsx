import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeProvider as ColorThemeProvider } from "@/contexts/theme-context";
import { UserRoleProvider } from "@/contexts/user-role-context";
import { AuthProvider } from "@/contexts/auth-context";
import { PermissionsProvider } from "@/contexts/permissions-context";
import { GlobalErrorHandler } from "@/components/global-error-handler";
import { ConsoleDebugger } from "@/components/console-debugger";
import { RoleSynchronizer } from "@/components/role-synchronizer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FTV",
  description: "FTV Adminisztációs felület",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <GlobalErrorHandler />
        <ConsoleDebugger />
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
          disableTransitionOnChange
        >
          <ColorThemeProvider>
            <AuthProvider>
              <PermissionsProvider>
                <UserRoleProvider>
                  <RoleSynchronizer />
                  <div className="relative flex min-h-screen flex-col">
                    {children}
                  </div>
                </UserRoleProvider>
              </PermissionsProvider>
            </AuthProvider>
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
