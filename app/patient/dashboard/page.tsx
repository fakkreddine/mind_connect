import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen, CalendarCheck, CheckCircle2, Clock, HeartPulse, Music, Quote, Sparkles, Video } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WellnessTask } from "@/components/wellness-task"
import { MoodTracker } from "@/components/mood-tracker"
import { AudioPlayer } from "@/components/audio-player"
import { format } from "date-fns"

// Mock data for wellness tasks and calming tracks
const wellnessTasks = [
  {
    id: "1",
    title: "Deep Breathing",
    description: "Practice deep breathing for 5 minutes",
    duration: "5 min",
    icon: "breathing",
  },
  {
    id: "2",
    title: "Gratitude Journal",
    description: "Write down 3 things you're grateful for today",
    duration: "10 min",
    icon: "journal",
  },
  {
    id: "3",
    title: "Mindful Walk",
    description: "Take a short walk with full awareness of your surroundings",
    duration: "15 min",
    icon: "walking",
  },
]

const calmingTracks = [
  {
    id: "1",
    title: "Ocean Waves",
    duration: "10:30",
    cover: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "2",
    title: "Forest Ambience",
    duration: "8:45",
    cover: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "3",
    title: "Gentle Rain",
    duration: "12:20",
    cover: "/placeholder.svg?height=60&width=60",
  },
]

// Motivational quotes
const motivationalQuotes = [
  {
    quote: "You don't have to see the whole staircase, just take the first step.",
    author: "Martin Luther King Jr.",
  },
  {
    quote: "The way I see it, if you want the rainbow, you gotta put up with the rain.",
    author: "Dolly Parton",
  },
  {
    quote: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
  },
]

export default async function PatientDashboard() {
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

  // Get upcoming session
  const { data: upcomingSessions, error: sessionError } = await supabase
    .from("sessions")
    .select(`
      *,
      therapist:therapist_id(
        id,
        full_name,
        avatar_url,
        therapist_profiles(specialty)
      )
    `)
    .eq("patient_id", session.user.id)
    .gte("scheduled_at", new Date().toISOString())
    .in("status", ["scheduled", "confirmed"])
    .order("scheduled_at", { ascending: true })
    .limit(1)

  if (sessionError) {
    console.error("Error fetching upcoming session:", sessionError)
  }

  const upcomingSession = upcomingSessions && upcomingSessions.length > 0 ? upcomingSessions[0] : null

  // Get therapy tasks
  const { data: therapyTasks, error: tasksError } = await supabase
    .from("therapy_tasks")
    .select("*")
    .eq("patient_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  if (tasksError) {
    console.error("Error fetching therapy tasks:", tasksError)
  }

  // Get a random quote for today
  const todayQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]

  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userData.full_name.split(" ")[0]}</h1>
        <p className="text-muted-foreground">Here's your wellness journey for today</p>
      </div>

      {/* Daily Quote Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-3">
              <Quote className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-medium italic text-blue-800 dark:text-blue-300">"{todayQuote.quote}"</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">— {todayQuote.author}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Session Card */}
        <Card className="overflow-hidden border-none shadow-md bg-white dark:bg-gray-900">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
            <div className="flex items-center gap-2 text-white">
              <Video className="h-5 w-5" />
              <h2 className="font-semibold">Upcoming Session</h2>
            </div>
          </div>
          {upcomingSession ? (
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 border-2 border-blue-100 dark:border-blue-900">
                  <AvatarImage
                    src={upcomingSession.therapist.avatar_url || "/placeholder.svg?height=40&width=40"}
                    alt={upcomingSession.therapist.full_name}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {upcomingSession.therapist.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-medium text-lg">{upcomingSession.therapist.full_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {upcomingSession.therapist.therapist_profiles[0]?.specialty || "Therapist"}
                  </p>
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full">
                      <CalendarCheck className="h-3.5 w-3.5" />
                      <span>{format(new Date(upcomingSession.scheduled_at), "MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{format(new Date(upcomingSession.scheduled_at), "h:mm a")}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/patient/sessions">View Details</Link>
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  asChild
                >
                  <Link href={`/patient/session/${upcomingSession.id}`}>
                    <Video className="mr-2 h-4 w-4" />
                    Join Session
                  </Link>
                </Button>
              </div>
            </CardContent>
          ) : (
            <CardContent>
              <p className="text-center text-muted-foreground py-4">No upcoming sessions scheduled</p>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                asChild
              >
                <Link href="/patient/therapists">Find a Therapist</Link>
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Mood Tracker Card */}
        <Card className="border-none shadow-md bg-white dark:bg-gray-900">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
            <div className="flex items-center gap-2 text-white">
              <HeartPulse className="h-5 w-5" />
              <h2 className="font-semibold">Your Mood Journey</h2>
            </div>
          </div>
          <CardContent className="p-6">
            <MoodTracker />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Therapy Tasks Card */}
        <Card className="border-none shadow-md bg-white dark:bg-gray-900 md:col-span-2">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4">
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2 className="h-5 w-5" />
              <h2 className="font-semibold">Your Therapy Journey</h2>
            </div>
          </div>
          <CardContent className="p-6">
            <Tabs defaultValue="tasks">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="tasks">Therapy Tasks</TabsTrigger>
                <TabsTrigger value="wellness">Daily Wellness</TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {therapyTasks?.filter((task) => task.completed).length || 0}/{therapyTasks?.length || 0} completed
                  </span>
                </div>
                <Progress
                  value={
                    therapyTasks?.length
                      ? (therapyTasks.filter((task) => task.completed).length / therapyTasks.length) * 100
                      : 0
                  }
                  className="h-2 bg-emerald-100 dark:bg-emerald-950/30"
                  indicatorClassName="bg-gradient-to-r from-emerald-600 to-teal-600"
                />
                <ul className="space-y-3 pt-2">
                  {therapyTasks && therapyTasks.length > 0 ? (
                    therapyTasks.map((task) => (
                      <li
                        key={task.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20"
                      >
                        <div
                          className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center ${
                            task.completed
                              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                              : "border-2 border-emerald-200 dark:border-emerald-800"
                          }`}
                        >
                          {task.completed && <CheckCircle2 className="h-4 w-4" />}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            Due: {task.due_date ? format(new Date(task.due_date), "MMMM d, yyyy") : "No due date"}
                          </p>
                        </div>
                        {!task.completed && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300"
                          >
                            Complete
                          </Button>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-muted-foreground py-4">No therapy tasks assigned yet</li>
                  )}
                </ul>
              </TabsContent>

              <TabsContent value="wellness">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {wellnessTasks.map((task) => (
                    <WellnessTask key={task.id} task={task} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Calming Sounds Card */}
        <Card className="border-none shadow-md bg-white dark:bg-gray-900">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4">
            <div className="flex items-center gap-2 text-white">
              <Music className="h-5 w-5" />
              <h2 className="font-semibold">Calming Sounds</h2>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              {calmingTracks.map((track) => (
                <AudioPlayer key={track.id} track={track} />
              ))}
              <Button variant="outline" className="w-full mt-2">
                Browse More Sounds
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Resources Card */}
        <Card className="border-none shadow-md bg-white dark:bg-gray-900">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-4">
            <div className="flex items-center gap-2 text-white">
              <BookOpen className="h-5 w-5" />
              <h2 className="font-semibold">Recommended Resources</h2>
            </div>
          </div>
          <CardContent className="p-6">
            <ul className="space-y-3">
              <li className="p-3 rounded-lg bg-violet-50 dark:bg-violet-950/20">
                <Link href="#" className="flex items-start gap-3 hover:opacity-80 transition-opacity">
                  <div className="rounded-md bg-violet-100 dark:bg-violet-900/50 p-2">
                    <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-violet-800 dark:text-violet-300">Stress Management Guide</h3>
                    <p className="text-sm text-violet-600 dark:text-violet-400">
                      Practical techniques for managing daily stress
                    </p>
                  </div>
                </Link>
              </li>
              <li className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <Link href="#" className="flex items-start gap-3 hover:opacity-80 transition-opacity">
                  <div className="rounded-md bg-purple-100 dark:bg-purple-900/50 p-2">
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-800 dark:text-purple-300">Mindfulness Techniques</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Simple mindfulness exercises for daily practice
                    </p>
                  </div>
                </Link>
              </li>
              <li className="p-3 rounded-lg bg-violet-50 dark:bg-violet-950/20">
                <Link href="#" className="flex items-start gap-3 hover:opacity-80 transition-opacity">
                  <div className="rounded-md bg-violet-100 dark:bg-violet-900/50 p-2">
                    <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-violet-800 dark:text-violet-300">Sleep Improvement Strategies</h3>
                    <p className="text-sm text-violet-600 dark:text-violet-400">
                      Evidence-based approaches to better sleep
                    </p>
                  </div>
                </Link>
              </li>
            </ul>
            <Button variant="outline" className="w-full mt-4">
              View All Resources
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="border-none shadow-md bg-white dark:bg-gray-900">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5" />
              <h2 className="font-semibold">Quick Actions</h2>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                className="h-auto py-4 justify-start bg-cyan-50 hover:bg-cyan-100 text-cyan-700 dark:bg-cyan-950/30 dark:hover:bg-cyan-950/50 dark:text-cyan-300"
                asChild
              >
                <Link href="/patient/book" className="flex flex-col items-start">
                  <div className="flex items-center w-full">
                    <CalendarCheck className="h-5 w-5 mr-2" />
                    <span>Book Session</span>
                  </div>
                  <span className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">Find available therapists</span>
                </Link>
              </Button>
              <Button
                className="h-auto py-4 justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 dark:text-blue-300"
                asChild
              >
                <Link href="/patient/therapists" className="flex flex-col items-start">
                  <div className="flex items-center w-full">
                    <Video className="h-5 w-5 mr-2" />
                    <span>Find Therapist</span>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 mt-1">Browse therapist profiles</span>
                </Link>
              </Button>
              <Button
                className="h-auto py-4 justify-start bg-cyan-50 hover:bg-cyan-100 text-cyan-700 dark:bg-cyan-950/30 dark:hover:bg-cyan-950/50 dark:text-cyan-300"
                asChild
              >
                <Link href="/patient/messages" className="flex flex-col items-start">
                  <div className="flex items-center w-full">
                    <Video className="h-5 w-5 mr-2" />
                    <span>Messages</span>
                  </div>
                  <span className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">Contact your therapist</span>
                </Link>
              </Button>
              <Button
                className="h-auto py-4 justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 dark:text-blue-300"
                asChild
              >
                <Link href="/patient/chat" className="flex flex-col items-start">
                  <div className="flex items-center w-full">
                    <Video className="h-5 w-5 mr-2" />
                    <span>AI Assistant</span>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 mt-1">Get personalized help</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
