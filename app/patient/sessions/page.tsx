"use client"

import { useState } from "react"
import { format } from "date-fns"
import Link from "next/link"
import { Calendar, Clock, Download, FileText, Filter, Search, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { MotivationalQuote } from "@/components/motivational-quote"

// Mock data for sessions
const sessions = [
  {
    id: "1",
    therapist: {
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      specialty: "Cognitive Behavioral Therapy",
    },
    date: new Date(2025, 4, 15, 15, 0), // May 15, 2025, 3:00 PM
    duration: 50,
    status: "upcoming",
    notes: "",
    recording: false,
    transcript: false,
  },
  {
    id: "2",
    therapist: {
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      specialty: "Cognitive Behavioral Therapy",
    },
    date: new Date(2025, 4, 8, 15, 0), // May 8, 2025, 3:00 PM
    duration: 50,
    status: "completed",
    notes: "Discussed anxiety management techniques and practiced mindfulness exercises.",
    recording: true,
    transcript: true,
  },
  {
    id: "3",
    therapist: {
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      specialty: "Cognitive Behavioral Therapy",
    },
    date: new Date(2025, 4, 1, 15, 0), // May 1, 2025, 3:00 PM
    duration: 50,
    status: "completed",
    notes: "Initial assessment. Discussed therapy goals and background history.",
    recording: true,
    transcript: true,
  },
  {
    id: "4",
    therapist: {
      name: "Dr. Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      specialty: "Psychodynamic Therapy",
    },
    date: new Date(2025, 3, 24, 14, 0), // April 24, 2025, 2:00 PM
    duration: 50,
    status: "completed",
    notes: "Explored childhood experiences and their impact on current relationship patterns.",
    recording: true,
    transcript: true,
  },
  {
    id: "5",
    therapist: {
      name: "Dr. Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      specialty: "Psychodynamic Therapy",
    },
    date: new Date(2025, 3, 17, 14, 0), // April 17, 2025, 2:00 PM
    duration: 50,
    status: "completed",
    notes: "Discussed recent stressors and coping mechanisms.",
    recording: false,
    transcript: true,
  },
]

// Mock data for therapy progress
const therapyProgress = {
  sessionsCompleted: 4,
  totalSessions: 12,
  goalsProgress: [
    { goal: "Reduce anxiety", progress: 60 },
    { goal: "Improve sleep quality", progress: 40 },
    { goal: "Develop coping strategies", progress: 75 },
  ],
  nextMilestone: "Mid-therapy assessment",
  nextMilestoneDate: new Date(2025, 5, 1), // June 1, 2025
}

export default function PatientSessionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter sessions based on search query and active tab
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.therapist.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (session.notes && session.notes.toLowerCase().includes(searchQuery.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "upcoming") return matchesSearch && session.status === "upcoming"
    if (activeTab === "completed") return matchesSearch && session.status === "completed"

    return matchesSearch
  })

  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Sessions</h1>
        <p className="text-muted-foreground">View and manage your therapy sessions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  Session History
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search sessions..."
                      className="pl-9 h-9 w-full sm:w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 gap-1">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>All Therapists</DropdownMenuItem>
                      <DropdownMenuItem>Dr. Sarah Johnson</DropdownMenuItem>
                      <DropdownMenuItem>Dr. Michael Chen</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All Sessions</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="pt-4">
                  <div className="space-y-4">
                    {filteredSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={session.therapist.avatar} alt={session.therapist.name} />
                          <AvatarFallback>
                            {session.therapist.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3 className="font-medium">{session.therapist.name}</h3>
                            <Badge
                              variant="outline"
                              className={`${
                                session.status === "upcoming"
                                  ? "badge-blue"
                                  : session.status === "completed"
                                    ? "badge-green"
                                    : "badge-purple"
                              }`}
                            >
                              {session.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{session.therapist.specialty}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-blue-600" />
                              <span>{format(session.date, "MMMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-blue-600" />
                              <span>
                                {format(session.date, "h:mm a")} ({session.duration} min)
                              </span>
                            </div>
                          </div>
                          {session.notes && (
                            <p className="text-sm mt-2 line-clamp-2">
                              <span className="font-medium">Notes:</span> {session.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 sm:flex-col">
                          {session.status === "upcoming" ? (
                            <Button className="btn-gradient-blue" asChild>
                              <Link href={`/patient/session/${session.id}`}>Join</Link>
                            </Button>
                          ) : (
                            <>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/patient/session/${session.id}/summary`}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Summary
                                </Link>
                              </Button>
                              {session.recording && (
                                <Button variant="outline" size="sm">
                                  <Download className="mr-2 h-4 w-4" />
                                  Recording
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="upcoming" className="pt-4">
                  <div className="space-y-4">
                    {filteredSessions
                      .filter((session) => session.status === "upcoming")
                      .map((session) => (
                        <div
                          key={session.id}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={session.therapist.avatar} alt={session.therapist.name} />
                            <AvatarFallback>
                              {session.therapist.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <h3 className="font-medium">{session.therapist.name}</h3>
                              <Badge variant="outline" className="badge-blue">
                                {session.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{session.therapist.specialty}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                                <span>{format(session.date, "MMMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-blue-600" />
                                <span>
                                  {format(session.date, "h:mm a")} ({session.duration} min)
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button className="btn-gradient-blue" asChild>
                              <Link href={`/patient/session/${session.id}`}>Join</Link>
                            </Button>
                            <Button variant="outline">Reschedule</Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="completed" className="pt-4">
                  <div className="space-y-4">
                    {filteredSessions
                      .filter((session) => session.status === "completed")
                      .map((session) => (
                        <div
                          key={session.id}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={session.therapist.avatar} alt={session.therapist.name} />
                            <AvatarFallback>
                              {session.therapist.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <h3 className="font-medium">{session.therapist.name}</h3>
                              <Badge variant="outline" className="badge-green">
                                {session.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{session.therapist.specialty}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                                <span>{format(session.date, "MMMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-blue-600" />
                                <span>
                                  {format(session.date, "h:mm a")} ({session.duration} min)
                                </span>
                              </div>
                            </div>
                            {session.notes && (
                              <p className="text-sm mt-2 line-clamp-2">
                                <span className="font-medium">Notes:</span> {session.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 sm:flex-col">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/patient/session/${session.id}/summary`}>
                                <FileText className="mr-2 h-4 w-4" />
                                Summary
                              </Link>
                            </Button>
                            {session.recording && (
                              <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Recording
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-6">
          <MotivationalQuote variant="teal" refreshable />

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Therapy Progress
              </CardTitle>
              <CardDescription>Track your therapy journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sessions Completed</span>
                  <span className="text-sm text-muted-foreground">
                    {therapyProgress.sessionsCompleted}/{therapyProgress.totalSessions}
                  </span>
                </div>
                <Progress
                  value={(therapyProgress.sessionsCompleted / therapyProgress.totalSessions) * 100}
                  className="h-2"
                  indicatorClassName="bg-gradient-to-r from-blue-500 to-blue-600"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Goals Progress</h3>
                {therapyProgress.goalsProgress.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{goal.goal}</span>
                      <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                    </div>
                    <Progress
                      value={goal.progress}
                      className="h-2"
                      indicatorClassName={`bg-gradient-to-r ${
                        index === 0
                          ? "from-blue-500 to-blue-600"
                          : index === 1
                            ? "from-purple-500 to-purple-600"
                            : "from-teal-500 to-teal-600"
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4">
                <h3 className="text-sm font-medium">Next Milestone</h3>
                <p className="text-sm mt-1">{therapyProgress.nextMilestone}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(therapyProgress.nextMilestoneDate, "MMMM d, yyyy")}
                </p>
              </div>

              <Button className="w-full btn-gradient-blue">View Detailed Progress</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription>Manage your sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" asChild>
                <Link href="/patient/book">Book New Session</Link>
              </Button>
              <Button variant="outline" className="w-full">
                Request Session Notes
              </Button>
              <Button variant="outline" className="w-full">
                Download All Records
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
