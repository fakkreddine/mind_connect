"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Brain, Lock, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface AuthFormProps {
  defaultRole?: "patient" | "therapist"
}

export function AuthForm({ defaultRole = "patient" }: AuthFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [role, setRole] = useState<"patient" | "therapist">(defaultRole)
  const [specialty, setSpecialty] = useState("")

  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      // Redirect based on user role
      const { data: userData } = await supabase.from("users").select("user_type").eq("email", email).single()

      if (userData?.user_type === "patient") {
        router.push("/patient/dashboard")
      } else {
        router.push("/therapist/dashboard")
      }

      toast({
        title: "Sign in successful",
        description: "Welcome back to MindConnect!",
      })
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (role === "therapist" && !specialty) {
        throw new Error("Please enter your specialty")
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: role,
            specialty: role === "therapist" ? specialty : null,
          },
        },
      })

      if (error) {
        throw error
      }

      toast({
        title: "Sign up successful",
        description: "Please check your email to confirm your account.",
      })

      // Reset form
      setEmail("")
      setPassword("")
      setFullName("")
      setSpecialty("")
      setIsSignUp(false)
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <div className="flex justify-center">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to MindConnect</h1>
        <p className="text-sm text-muted-foreground">
          {isSignUp ? "Create an account to get started" : "Sign in to your account to continue"}
        </p>
      </div>

      <Tabs defaultValue={role} className="w-full" onValueChange={(value) => setRole(value as "patient" | "therapist")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="patient">Patient</TabsTrigger>
          <TabsTrigger value="therapist">Therapist</TabsTrigger>
        </TabsList>

        <TabsContent value="patient">
          <Card>
            <CardHeader>
              <CardTitle>{isSignUp ? "Patient Sign Up" : "Patient Login"}</CardTitle>
              <CardDescription>
                {isSignUp
                  ? "Create a patient account to connect with therapists"
                  : "Enter your credentials to access your patient account"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
              <CardContent className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="patient-name">Full Name</Label>
                    <Input
                      id="patient-name"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="patient-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="patient-email"
                      placeholder="name@example.com"
                      type="email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="patient-password"
                      type="password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
                </Button>
                <div className="text-center text-sm">
                  {isSignUp ? (
                    <>
                      Already have an account?{" "}
                      <button type="button" className="text-primary hover:underline" onClick={() => setIsSignUp(false)}>
                        Sign In
                      </button>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{" "}
                      <button type="button" className="text-primary hover:underline" onClick={() => setIsSignUp(true)}>
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="therapist">
          <Card>
            <CardHeader>
              <CardTitle>{isSignUp ? "Therapist Sign Up" : "Therapist Login"}</CardTitle>
              <CardDescription>
                {isSignUp
                  ? "Create a therapist account to provide mental health services"
                  : "Enter your credentials to access your therapist account"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
              <CardContent className="space-y-4">
                {isSignUp && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="therapist-name">Full Name</Label>
                      <Input
                        id="therapist-name"
                        placeholder="Dr. Jane Smith"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="therapist-specialty">Specialty</Label>
                      <Input
                        id="therapist-specialty"
                        placeholder="Cognitive Behavioral Therapy"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="therapist-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="therapist-email"
                      placeholder="name@example.com"
                      type="email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="therapist-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="therapist-password"
                      type="password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
                </Button>
                <div className="text-center text-sm">
                  {isSignUp ? (
                    <>
                      Already have an account?{" "}
                      <button type="button" className="text-primary hover:underline" onClick={() => setIsSignUp(false)}>
                        Sign In
                      </button>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{" "}
                      <button type="button" className="text-primary hover:underline" onClick={() => setIsSignUp(true)}>
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
