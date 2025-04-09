import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AIChatbot } from "@/components/ai-chatbot"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, BookOpen, Sparkles } from "lucide-react"

export default async function PatientChatPage() {
  const supabase = createClient()

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user data
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single()

  if (userError || !userData) {
    console.error("Error fetching user data:", userError)
    redirect("/login")
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">Get personalized support and answers to your questions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 h-[calc(100vh-12rem)]">
          <AIChatbot />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                How Can I Help You?
              </CardTitle>
              <CardDescription>Your AI assistant can help with:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-blue-100 dark:bg-blue-900/50 p-2">
                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Therapy Resources</h3>
                    <p className="text-sm text-muted-foreground">
                      Ask for personalized resources based on your therapy goals
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-purple-100 dark:bg-purple-900/50 p-2">
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Wellness Techniques</h3>
                    <p className="text-sm text-muted-foreground">
                      Get suggestions for managing stress, anxiety, or improving sleep
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-green-100 dark:bg-green-900/50 p-2">
                    <Brain className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Session Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Ask about your upcoming sessions or therapy progress
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Privacy Notice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your conversations with the AI assistant are private and secure. The AI uses your therapy history and
                preferences to provide personalized support, but does not replace professional medical advice.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
