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
import { EnhancedErrorBoundary } from "@/components/enhanced-error-boundary";
import { ConnectionStatus } from "@/components/connection-status";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FTV (BETA)",
  description: "FTV Adminisztációs felület - Early Access BETA verzió",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover"
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(0.929 0.013 255.508)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(1 0 0 / 10%)" }
  ]
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
        <EnhancedErrorBoundary>
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
                    <ConnectionStatus showText={false} />
                    <div className="relative flex min-h-screen flex-col">
                      <div className="transition-opacity duration-500 ease-in-out opacity-100" id="page-transition">
                        {children}
                      </div>
                    </div>
                  </UserRoleProvider>
                </PermissionsProvider>
              </AuthProvider>
            </ColorThemeProvider>
          </ThemeProvider>
        </EnhancedErrorBoundary>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
