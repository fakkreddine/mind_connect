"use client"

import { useState } from "react"
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MotivationalQuote } from "@/components/motivational-quote"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for sessions
const sessions = [
  {
    id: "1",
    patient: {
      name: "John Patient",
      avatar: "/placeholder.svg?height=40&width=40",
      issues: "Anxiety, Depression",
    },
    date: "2025-05-15T15:00:00",
    duration: 50,
    status: "confirmed",
  },
  {
    id: "2",
    patient: {
      name: "Emily Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      issues: "Stress Management",
    },
    date: "2025-05-15T16:00:00",
    duration: 50,
    status: "confirmed",
  },
  {
    id: "3",
    patient: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      issues: "Relationship Issues",
    },
    date: "2025-05-16T14:00:00",
    duration: 50,
    status: "confirmed",
  },
  {
    id: "4",
    patient: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      issues: "Work-related Stress",
    },
    date: "2025-05-17T10:00:00",
    duration: 50,
    status: "pending",
  },
  {
    id: "5",
    patient: {
      name: "David Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      issues: "Anxiety",
    },
    date: "2025-05-18T11:00:00",
    duration: 50,
    status: "confirmed",
  },
]

// Mock data for availability
const availability = [
  { day: "Monday", slots: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"] },
  { day: "Tuesday", slots: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"] },
  { day: "Wednesday", slots: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"] },
  { day: "Thursday", slots: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"] },
  { day: "Friday", slots: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"] },
]

// Time slots for the day view
const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]

export default function TherapistCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<"week" | "day">("week")

  // Get the start of the week for the current date
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 })

  // Generate the days of the week
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i))

  // Navigate to the previous week/day
  const goToPrevious = () => {
    if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1))
    } else {
      setCurrentDate(addDays(currentDate, -1))
      setSelectedDate(addDays(currentDate, -1))
    }
  }

  // Navigate to the next week/day
  const goToNext = () => {
    if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1))
    } else {
      setCurrentDate(addDays(currentDate, 1))
      setSelectedDate(addDays(currentDate, 1))
    }
  }

  // Get sessions for a specific day
  const getSessionsForDay = (day: Date) => {
    return sessions.filter((session) => isSameDay(parseISO(session.date), day))
  }

  // Get session for a specific time slot on the selected day
  const getSessionForTimeSlot = (timeSlot: string) => {
    const sessionsForDay = getSessionsForDay(selectedDate)
    return sessionsForDay.find((session) => {
      const sessionTime = format(parseISO(session.date), "h:mm a")
      return sessionTime === timeSlot
    })
  }

  // Switch to day view and set the selected date
  const viewDay = (day: Date) => {
    setSelectedDate(day)
    setView("day")
  }

  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Calendar</h1>
        <p className="text-muted-foreground">Manage your schedule and appointments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                    {view === "week" ? "Weekly Schedule" : format(selectedDate, "MMMM d, yyyy")}
                  </CardTitle>
                  {view === "day" && (
                    <Button variant="outline" size="sm" onClick={() => setView("week")}>
                      Back to Week View
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={goToPrevious}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {view === "week"
                      ? `${format(startOfCurrentWeek, "MMMM d")} - ${format(
                          addDays(startOfCurrentWeek, 6),
                          "MMMM d, yyyy",
                        )}`
                      : format(selectedDate, "MMMM d, yyyy")}
                  </span>
                  <Button variant="outline" size="icon" onClick={goToNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {view === "week" ? "View and manage your weekly schedule" : "View and manage your daily schedule"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {view === "week" ? (
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day, index) => {
                    const sessionsForDay = getSessionsForDay(day)
                    const isToday = isSameDay(day, new Date())

                    return (
                      <div key={index} className="text-center">
                        <div className="mb-1 text-sm font-medium">{format(day, "EEE")}</div>
                        <button
                          className={`w-10 h-  "EEE")}</div>
                        <button
                          className={\`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm transition-colors ${
                            isToday
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          }`}
                          onClick={() => viewDay(day)}
                        >
                          {format(day, "d")}
                        </button>
                        <div className="mt-2 space-y-1">
                          {sessionsForDay.map((session) => (
                            <div key={session.id} className="text-xs">
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
                                {format(parseISO(session.date), "h:mm a")}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {timeSlots.map((timeSlot) => {
                    const session = getSessionForTimeSlot(timeSlot)

                    return (
                      <div
                        key={timeSlot}
                        className={`flex items-center gap-4 p-3 rounded-lg border ${
                          session ? "bg-blue-50 dark:bg-blue-950/20" : ""
                        }`}
                      >
                        <div className="w-20 text-sm font-medium">{timeSlot}</div>
                        {session ? (
                          <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={session.patient.avatar} alt={session.patient.name} />
                                <AvatarFallback>
                                  {session.patient.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{session.patient.name}</p>
                                <p className="text-sm text-muted-foreground">{session.patient.issues}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/therapist/patients/${session.id}`}>View Profile</Link>
                              </Button>
                              <Button className="btn-gradient-blue" size="sm" asChild>
                                <Link href={`/therapist/session/${session.id}`}>Join</Link>
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Available</span>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Session
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Schedule New Session</DialogTitle>
                                  <DialogDescription>
                                    Create a new therapy session on {format(selectedDate, "MMMM d, yyyy")} at {timeSlot}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="patient">Patient</Label>
                                    <Select>
                                      <SelectTrigger id="patient">
                                        <SelectValue placeholder="Select patient" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="john">John Patient</SelectItem>
                                        <SelectItem value="emily">Emily Wilson</SelectItem>
                                        <SelectItem value="michael">Michael Brown</SelectItem>
                                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                                        <SelectItem value="david">David Lee</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="duration">Duration</Label>
                                    <Select defaultValue="50">
                                      <SelectTrigger id="duration">
                                        <SelectValue placeholder="Select duration" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="30">30 minutes</SelectItem>
                                        <SelectItem value="50">50 minutes</SelectItem>
                                        <SelectItem value="80">80 minutes</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="notes">Session Notes</Label>
                                    <Input id="notes" placeholder="Add any notes for this session" />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="submit">Schedule Session</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <MotivationalQuote variant="purple" refreshable />

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Your Availability
              </CardTitle>
              <CardDescription>Your regular working hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availability.map((day) => (
                <div key={day.day} className="space-y-2">
                  <div className="font-medium">{day.day}</div>
                  <div className="space-y-1">
                    {day.slots.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{slot}</span>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Button className="w-full btn-gradient-blue">
                <Settings className="mr-2 h-4 w-4" />
                Manage Availability
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Patient Reminders
              </CardTitle>
              <CardDescription>Upcoming session reminders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">3 patients</span> have sessions tomorrow
                </p>
                <p className="text-sm">
                  <span className="font-medium">2 patients</span> need to confirm their appointments
                </p>
                <p className="text-sm">
                  <span className="font-medium">1 patient</span> requested a reschedule
                </p>
              </div>
              <Button variant="outline" className="w-full">
                Send Reminders
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full btn-gradient-blue">
                <Plus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
              <Button variant="outline" className="w-full">
                Block Time Off
              </Button>
              <Button variant="outline" className="w-full">
                Set Recurring Sessions
              </Button>
              <Button variant="outline" className="w-full">
                Export Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
