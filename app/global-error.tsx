'use client'

import { useEffect } from 'react'
import { Clapperboard, RefreshCw, AlertTriangle, Bug, Mail } from "lucide-react"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  const errorId = `global_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  return (
    <html lang="hu">
      <body>
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          {/* Header */}
          <header className="border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur">
            <div className="container flex items-center justify-between px-4 py-4 mx-auto">
              <div className="flex items-center gap-3 text-2xl font-bold">
                <Clapperboard className="w-8 h-8 text-blue-600" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span>FTV</span>
                    <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full border border-orange-200 dark:border-orange-700">
                      BETA
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-normal leading-none">
                    Hiányzás Áttekintő Platform
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex items-center justify-center px-4 py-16">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              {/* Large Error Icon */}
              <div className="relative">
                <div className="mx-auto w-48 h-48 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-24 h-24 text-red-500 dark:text-red-400" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl font-bold text-red-200 dark:text-red-800">!</span>
                </div>
              </div>

              {/* Error Message */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Kritikus alkalmazás hiba
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                  Váratlan hiba történt az alkalmazás betöltése során. Kérjük, frissítse az oldalt vagy próbálja meg később.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors w-full sm:w-auto"
                >
                  <RefreshCw className="w-5 h-5" />
                  Újrapróbálás
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors w-full sm:w-auto"
                >
                  Főoldal
                </button>
              </div>

              {/* Error Details Card */}
              <div className="mt-12 max-w-lg mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Bug className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="font-semibold">Hiba részletei</h3>
                  </div>
                  
                  <div className="text-left space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Hiba ID:</p>
                      <code className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded block font-mono">
                        {errorId}
                      </code>
                    </div>
                    
                    {error.digest && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Digest:</p>
                        <code className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded block font-mono">
                          {error.digest}
                        </code>
                      </div>
                    )}

                    {process.env.NODE_ENV === 'development' && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Fejlesztői üzenet:</p>
                        <code className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded block font-mono break-all">
                          {error.message}
                        </code>
                      </div>
                    )}
                  </div>

                  {/* Support Contact */}
                  <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <p className="font-medium text-sm text-blue-900 dark:text-blue-100">
                        Segítségre van szüksége?
                      </p>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                      Ha a probléma továbbra is fennáll, lépjen kapcsolatba a fejlesztőkkel.
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Hiba ID: {errorId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t py-8">
            <div className="container px-4 mx-auto">
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <p>© {new Date().getFullYear()} FTV - Kőbányai Szent László Gimnázium</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}