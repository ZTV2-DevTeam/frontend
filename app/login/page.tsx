import { Clapperboard } from "lucide-react"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"
import { ErrorBoundary } from "@/components/error-boundary"

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 bg-muted min-h-svh md:p-10">
      <div className="flex flex-col w-full max-w-sm gap-6">
        <Link href="/" className="flex items-center self-center gap-2 font-medium cursor-pointer">
          <Clapperboard className="size-6 text-primary" />
          FTV
        </Link>
        <ErrorBoundary>
          <LoginForm />
        </ErrorBoundary>
      </div>
    </div>
  )
}
