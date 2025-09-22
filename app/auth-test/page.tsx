import { AuthDebugHelper } from "@/components/auth-debug-helper"

export default function AuthTestPage() {
  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="container mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">Authentication Debug Test</h1>
        <AuthDebugHelper />
      </div>
    </div>
  )
}