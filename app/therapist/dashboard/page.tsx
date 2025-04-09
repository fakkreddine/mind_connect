import Link from "next/link"
import { CalendarCheck, Clock, Users, Video, ArrowRight, Brain, FileText, Lightbulb, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MotivationalQuote } from "@/components/motivational-quote"

// Mock data
const upcomingSessions = [
  {
    id: "1",
    patient: {
      name: "John Patient",
      avatar: "/placeholder.svg?height=40&width=40",
      issues: "Anxiety, Depression",
    },
    date: "May 15, 2025",
    time: "3:00 PM",
    duration: "50 minutes",
    status: "confirmed",
  },
  {
    id: "2",
    patient: {
      name: "Emily Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      issues: "Stress Management",
    },
    date: "May 15, 2025",
    time: "4:00 PM",
    duration: "50 minutes",
    status: "confirmed",
  },
]

const recentPatients = [
  {
    id: "1",
    name: "John Patient",
    avatar: "/placeholder.svg?height=40&width=40",
    lastSession: "May 8, 2025",
    nextSession: "May 15, 2025",
    issues: "Anxiety, Depression",
    progress: 65,
    alerts: ["Reported increased anxiety", "Sleep difficulties"],
  },
  {
    id: "2",
    name: "Emily Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastSession: "May 10, 2025",
    nextSession: "May 15, 2025",
    issues: "Stress Management",
    progress: 80,
    alerts: [],
  },
  {
    id: "3",
    name: "Michael Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    lastSession: "May 7, 2025",
    nextSession: "May 21, 2025",
    issues: "Relationship Issues",
    progress: 45,
    alerts: ["Missed homework assignments"],
  },
]

const aiInsights = [
  {
    id: "1",
    title: "Patient Trends",
    description:
      "3 patients have reported increased anxiety this week. Consider reviewing coping strategies in upcoming sessions.",
    type: "trend",
    priority: "medium",
  },
  {
    id: "2",
    title: "Session Preparation",
    description:
      "John Patient mentioned work stress in his mood journal. Review his recent entries before today's session.",
    type: "preparation",
    priority: "high",
  },
  {
    id: "3",
    title: "Treatment Suggestion",
    description:
      "Based on Emily Wilson's progress, consider introducing mindfulness-based stress reduction techniques.",
    type: "suggestion",
    priority: "medium",
  },
]

const weeklyMetrics = {
  sessionsCompleted: 12,
  newPatients: 2,
  patientProgress: 78,
  notesCompleted: 10,
}

export default function TherapistDashboard() {
  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Dr. Thomas</h1>
        <p className="text-muted-foreground">Here's an overview of your schedule and patients</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-3">
                    <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">{weeklyMetrics.sessionsCompleted}</CardTitle>
                  <CardDescription>Sessions Completed</CardDescription>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 dark:bg-purple-950/30 border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-3">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">{weeklyMetrics.newPatients}</CardTitle>
                  <CardDescription>New Patients</CardDescription>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-950/30 border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-3">
                    <ArrowRight className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">{weeklyMetrics.patientProgress}%</CardTitle>
                  <CardDescription>Patient Progress</CardDescription>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-teal-50 dark:bg-teal-950/30 border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="rounded-full bg-teal-100 dark:bg-teal-900/50 p-3">
                    <FileText className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <CardTitle className="text-xl">{weeklyMetrics.notesCompleted}</CardTitle>
                  <CardDescription>Notes Completed</CardDescription>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-600" />
                <span>Today's Sessions</span>
              </CardTitle>
              <CardDescription>Your upcoming therapy appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session.patient.avatar} alt={session.patient.name} />
                        <AvatarFallback>
                          {session.patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{session.patient.name}</h3>
                          <Badge variant="outline" className="badge-green">
                            {session.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{session.patient.issues}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-blue-600" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarCheck className="h-3.5 w-3.5 text-blue-600" />
                            <span>{session.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/therapist/patients/${session.patient.name.toLowerCase().replace(" ", "-")}`}>
                            View Profile
                          </Link>
                        </Button>
                        <Button className="btn-gradient-blue" size="sm" asChild>
                          <Link href={`/therapist/session/${session.id}`}>Join</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No sessions scheduled for today</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/therapist/calendar">View Full Schedule</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>AI Insights</span>
              </CardTitle>
              <CardDescription>AI-generated insights to help with your practice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border ${
                      insight.priority === "high"
                        ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                        : insight.type === "trend"
                          ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                          : "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`rounded-full p-2 ${
                          insight.priority === "high"
                            ? "bg-red-100 dark:bg-red-900/50"
                            : insight.type === "trend"
                              ? "bg-blue-100 dark:bg-blue-900/50"
                              : "bg-purple-100 dark:bg-purple-900/50"
                        }`}
                      >
                        {insight.type === "trend" ? (
                          <Users
                            className={`h-5 w-5 ${
                              insight.priority === "high"
                                ? "text-red-600 dark:text-red-400"
                                : "text-blue-600 dark:text-blue-400"
                            }`}
                          />
                        ) : insight.type === "preparation" ? (
                          <FileText
                            className={`h-5 w-5 ${
                              insight.priority === "high"
                                ? "text-red-600 dark:text-red-400"
                                : "text-purple-600 dark:text-purple-400"
                            }`}
                          />
                        ) : (
                          <Lightbulb
                            className={`h-5 w-5 ${
                              insight.priority === "high"
                                ? "text-red-600 dark:text-red-400"
                                : "text-purple-600 dark:text-purple-400"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{insight.title}</h3>
                          {insight.priority === "high" && (
                            <Badge variant="outline" className="badge-red">
                              High Priority
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm mt-1">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Insights
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <MotivationalQuote variant="teal" refreshable />

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Patient Overview</span>
              </CardTitle>
              <CardDescription>Summary of your patient caseload</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-3xl font-bold text-blue-600">12</p>
                    <p className="text-sm text-muted-foreground">Active Patients</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-3xl font-bold text-blue-600">8</p>
                    <p className="text-sm text-muted-foreground">Sessions This Week</p>
                  </div>
                </div>

                <Tabs defaultValue="recent">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="recent">Recent Patients</TabsTrigger>
                    <TabsTrigger value="needs-attention">Needs Attention</TabsTrigger>
                  </TabsList>
                  <TabsContent value="recent" className="pt-4">
                    <div className="space-y-3">
                      {recentPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className="flex flex-col p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={patient.avatar} alt={patient.name} />
                              <AvatarFallback>
                                {patient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium truncate">{patient.name}</p>
                                <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                  <Link href={`/therapist/patients/${patient.id}`}>
                                    <span className="sr-only">View patient</span>
                                    <ArrowRight className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{patient.issues}</p>
                            </div>
                          </div>

                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>Progress</span>
                              <span>{patient.progress}%</span>
                            </div>
                            <Progress
                              value={patient.progress}
                              className="h-1.5"
                              indicatorClassName={`bg-gradient-to-r ${
                                patient.progress < 50
                                  ? "from-red-500 to-red-600"
                                  : patient.progress < 75
                                    ? "from-yellow-500 to-yellow-600"
                                    : "from-green-500 to-green-600"
                              }`}
                            />
                          </div>

                          {patient.alerts && patient.alerts.length > 0 && (
                            <div className="mt-2">
                              {patient.alerts.map((alert, index) => (
                                <Badge key={index} variant="outline" className="badge-red mr-2 mt-1">
                                  {alert}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Last: {patient.lastSession}</span>
                            <span>Next: {patient.nextSession}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="needs-attention" className="pt-4">
                    <div className="space-y-3">
                      {recentPatients
                        .filter((patient) => patient.alerts && patient.alerts.length > 0)
                        .map((patient) => (
                          <div
                            key={patient.id}
                            className="flex flex-col p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={patient.avatar} alt={patient.name} />
                                <AvatarFallback>
                                  {patient.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium truncate">{patient.name}</p>
                                  <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                    <Link href={`/therapist/patients/${patient.id}`}>
                                      <span className="sr-only">View patient</span>
                                      <ArrowRight className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{patient.issues}</p>
                              </div>
                            </div>

                            <div className="mt-2">
                              {patient.alerts.map((alert, index) => (
                                <Badge key={index} variant="outline" className="badge-red mr-2 mt-1">
                                  {alert}
                                </Badge>
                              ))}
                            </div>

                            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                              <span>Last: {patient.lastSession}</span>
                              <span>Next: {patient.nextSession}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/therapist/patients">View All Patients</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button className="justify-start btn-gradient-blue" asChild>
                  <Link href="/therapist/schedule">
                    <CalendarCheck className="mr-2 h-4 w-4" />
                    Update Availability
                  </Link>
                </Button>
                <Button className="justify-start btn-gradient-purple" asChild>
                  <Link href="/therapist/patients/new">
                    <Users className="mr-2 h-4 w-4" />
                    Add New Patient
                  </Link>
                </Button>
                <Button className="justify-start btn-gradient-green" asChild>
                  <Link href="/therapist/messages">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Link>
                </Button>
                <Button className="justify-start btn-gradient-teal" asChild>
                  <Link href="/therapist/resources">
                    <FileText className="mr-2 h-4 w-4" />
                    Manage Resources
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
