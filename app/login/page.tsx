import { AuthForm } from "@/components/auth/auth-form"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const role = searchParams.role as "patient" | "therapist" | undefined

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <AuthForm defaultRole={role || "patient"} />
    </div>
  )
}
