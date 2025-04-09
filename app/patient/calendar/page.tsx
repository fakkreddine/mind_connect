"use client"

import { useState } from "react"
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MotivationalQuote } from "@/components/motivational-quote"
import Link from "next/link"

// Mock data for upcoming sessions
const upcomingSessions = [
  {
    id: "1",
    therapist: {
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      specialty: "Cognitive Behavioral Therapy",
    },
    date: new Date(2025, 4, 15, 15, 0), // May 15, 2025, 3:00 PM
    duration: 50,
    status: "confirmed",
  },
  {
    id: "2",
    therapist: {
      name: "Dr. Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      specialty: "Psychodynamic Therapy",
    },
    date: new Date(2025, 4, 22, 14, 0), // May 22, 2025, 2:00 PM
    duration: 50,
    status: "confirmed",
  },
  {
    id: "3",
    therapist: {
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      specialty: "Cognitive Behavioral Therapy",
    },
    date: new Date(2025, 4, 29, 15, 0), // May 29, 2025, 3:00 PM
    duration: 50,
    status: "pending",
  },
]

// Mock data for available time slots
const availableTimeSlots = [
  { time: "9:00 AM", available: true },
  { time: "10:00 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "1:00 PM", available: true },
  { time: "2:00 PM", available: false },
  { time: "3:00 PM", available: true },
  { time: "4:00 PM", available: true },
]

export default function PatientCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Get the start of the week for the current date
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 })

  // Generate the days of the week
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i))

  // Navigate to the previous week
  const goToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1))
  }

  // Navigate to the next week
  const goToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1))
  }

  // Check if a day has a session
  const getDaySession = (day: Date) => {
    return upcomingSessions.find((session) => isSameDay(session.date, day))
  }

  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Calendar</h1>
        <p className="text-muted-foreground">Manage your therapy sessions and appointments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  Weekly Schedule
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {format(startOfCurrentWeek, "MMMM d")} - {format(addDays(startOfCurrentWeek, 6), "MMMM d, yyyy")}
                  </span>
                  <Button variant="outline" size="icon" onClick={goToNextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>View and manage your upcoming therapy sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {daysOfWeek.map((day, index) => {
                  const session = getDaySession(day)
                  const isSelected = isSameDay(day, selectedDate)
                  const isToday = isSameDay(day, new Date())

                  return (
                    <div key={index} className="text-center">
                      <div className="mb-1 text-sm font-medium">{format(day, "EEE")}</div>
                      <button
                        className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm transition-colors ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : isToday
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        } ${session ? "ring-2 ring-blue-400 dark:ring-blue-600" : ""}`}
                        onClick={() => setSelectedDate(day)}
                      >
                        {format(day, "d")}
                      </button>
                      {session && (
                        <div className="mt-2 text-xs">
                          <Badge
                            variant="outline"
                            className={`${
                              session.status === "confirmed"
                                ? "badge-green"
                                : session.status === "pending"
                                  ? "badge-blue"
                                  : "badge-purple"
                            }`}
                          >
                            {format(session.date, "h:mm a")}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium">Available Time Slots for {format(selectedDate, "MMMM d, yyyy")}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {availableTimeSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={slot.available ? "outline" : "ghost"}
                      className={`flex items-center justify-center gap-2 ${
                        slot.available
                          ? "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      disabled={!slot.available}
                    >
                      <Clock className="h-4 w-4" />
                      <span>{slot.time}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-600" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>Your scheduled therapy appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
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
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{session.therapist.name}</h3>
                        <Badge
                          variant="outline"
                          className={`${
                            session.status === "confirmed"
                              ? "badge-green"
                              : session.status === "pending"
                                ? "badge-blue"
                                : "badge-purple"
                          }`}
                        >
                          {session.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{session.therapist.specialty}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3.5 w-3.5 text-blue-600" />
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
                    <div className="flex flex-col gap-2">
                      {session.status === "confirmed" && (
                        <Button className="btn-gradient-blue" asChild>
                          <Link href={`/patient/session/${session.id}`}>Join</Link>
                        </Button>
                      )}
                      <Button variant="outline">Reschedule</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <MotivationalQuote variant="blue" refreshable />

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription>Manage your appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full btn-gradient-blue" asChild>
                <Link href="/patient/book">Book New Session</Link>
              </Button>
              <Button variant="outline" className="w-full">
                View Past Sessions
              </Button>
              <Button variant="outline" className="w-full">
                Set Availability Preferences
              </Button>
              <Button variant="outline" className="w-full">
                Set Calendar Reminders
              </Button>
            </CardContent>
          </Card>

          <Card className="card-gradient-purple">
            <CardHeader>
              <CardTitle className="text-xl">Need Help?</CardTitle>
              <CardDescription>Support resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Having trouble with scheduling or need to make special arrangements? Our support team is here to help.
              </p>
              <Button variant="secondary" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
