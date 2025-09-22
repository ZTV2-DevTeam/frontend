import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeProvider as ColorThemeProvider } from "@/contexts/theme-context";
import { UserRoleProvider } from "@/contexts/user-role-context";
import { AuthProvider } from "@/contexts/auth-context";
import { PermissionsProvider } from "@/contexts/permissions-context";
import { ErrorToastProvider } from "@/contexts/error-toast-context";
import { GlobalErrorHandler } from "@/components/global-error-handler";
import { ConsoleDebugger } from "@/components/console-debugger";
import { RoleSynchronizer } from "@/components/role-synchronizer";
import { GlobalErrorBoundary } from "@/components/global-error-boundary";
import { ConnectionStatus } from "@/components/connection-status";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "@/components/ui/sonner"
import { AccessibilityProvider } from "@/components/accessibility-utils"
import { KeyboardNavigationEnhancer } from "@/components/keyboard-navigation"

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
        <GlobalErrorBoundary level="global">
          <ErrorToastProvider>
            <GlobalErrorHandler />
            <ConsoleDebugger />
            <AccessibilityProvider>
              <KeyboardNavigationEnhancer />
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
                        {/* Skip to content link for keyboard navigation */}
                        <a
                          href="#main-content"
                          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200"
                        >
                          Ugrás a fő tartalomhoz
                        </a>
                        <div className="relative flex min-h-screen flex-col">
                          <div className="transition-opacity duration-500 ease-in-out opacity-100" id="page-transition">
                            <main id="main-content" className="flex-1">
                              {children}
                            </main>
                          </div>
                        </div>
                      </UserRoleProvider>
                    </PermissionsProvider>
                  </AuthProvider>
                </ColorThemeProvider>
              </ThemeProvider>
            </AccessibilityProvider>
          </ErrorToastProvider>
        </GlobalErrorBoundary>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
