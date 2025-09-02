"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AppPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard when accessing /app/app directly
    router.push("/app/iranyitopult")
  }, [router])

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Átirányítás a vezérlőpultra...</p>
      </div>
    </div>
  )
}
