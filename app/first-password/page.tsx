import { FirstPasswordRequestForm } from "@/components/first-password-request-form"

export default function FirstPasswordRequestPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <FirstPasswordRequestForm />
      </div>
    </div>
  )
}
