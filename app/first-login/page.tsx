'use client'

import { useSearchParams } from 'next/navigation'
import { FirstPasswordForm } from "@/components/first-password-form"
import { Suspense } from 'react'

function FirstLoginContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  if (!token) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="text-center text-red-600">
            <h1 className="text-xl font-semibold mb-2">Hiányzó token</h1>
            <p className="text-sm text-muted-foreground mb-4">
              Az első bejelentkezési link nem tartalmaz érvényes tokent.
            </p>
            <a href="/first-password" className="text-primary underline cursor-pointer">
              Új link kérése
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <FirstPasswordForm token={token} />
      </div>
    </div>
  )
}

export default function FirstLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Betöltés...</p>
        </div>
      </div>
    }>
      <FirstLoginContent />
    </Suspense>
  )
}
