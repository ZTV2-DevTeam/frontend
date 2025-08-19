import { FirstPasswordForm } from "@/components/first-password-form"
import { use } from "react"

interface Props {
  params: Promise<{
    token: string
  }>
}

export default function FirstPasswordTokenPage({ params }: Props) {
  const { token } = use(params)
  
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <FirstPasswordForm token={token} />
      </div>
    </div>
  )
}
