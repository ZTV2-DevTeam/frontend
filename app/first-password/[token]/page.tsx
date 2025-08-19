import { FirstPasswordForm } from "@/components/first-password-form"

interface Props {
  params: {
    token: string
  }
}

export default function FirstPasswordTokenPage({ params }: Props) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <FirstPasswordForm token={params.token} />
      </div>
    </div>
  )
}
