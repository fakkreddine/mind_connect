"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, CalendarCheck, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Mock data
const therapist = {
  id: "1",
  name: "Dr. Sarah Johnson",
  avatar: "/placeholder.svg?height=80&width=80",
  specialty: "Cognitive Behavioral Therapy",
  focus: ["Anxiety", "Depression", "Stress Management"],
  experience: "15 years",
  rating: 4.9,
  reviewCount: 124,
  nextAvailable: "Tomorrow",
  bio: "Dr. Johnson specializes in cognitive behavioral therapy with a focus on anxiety and depression. She has extensive experience helping clients develop practical strategies to manage their mental health.",
}

const availableDates = [
  { date: "May 15, 2025", day: "Monday", slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"] },
  { date: "May 16, 2025", day: "Tuesday", slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
  { date: "May 17, 2025", day: "Wednesday", slots: ["9:00 AM", "12:00 PM", "5:00 PM"] },
  { date: "May 18, 2025", day: "Thursday", slots: ["11:00 AM", "2:00 PM", "4:00 PM"] },
  { date: "May 19, 2025", day: "Friday", slots: ["9:00 AM", "1:00 PM", "3:00 PM"] },
]

export default function BookSessionPage({ params }: { params: { id: string } }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [sessionType, setSessionType] = useState("video")
  const [sessionDuration, setSessionDuration] = useState("50")
  const [notes, setNotes] = useState("")
  const [step, setStep] = useState(1)

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleContinue = () => {
    if (step === 1 && selectedDate && selectedTime) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const selectedDateObj = availableDates.find((d) => d.date === selectedDate)

  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/patient/therapists">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Book a Session</h1>
          <p className="text-muted-foreground">Schedule a therapy session with {therapist.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 ? "Select Date & Time" : step === 2 ? "Session Details" : "Confirm Booking"}
              </CardTitle>
              <CardDescription>
                {step === 1
                  ? "Choose when you'd like to meet"
                  : step === 2
                    ? "Provide additional information"
                    : "Review and confirm your appointment"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Select a Date</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {availableDates.map((date) => (
                        <button
                          key={date.date}
                          className={`flex flex-col items-center p-3 rounded-lg border ${
                            selectedDate === date.date ? "border-primary bg-primary/10" : "hover:border-primary/50"
                          }`}
                          onClick={() => handleDateSelect(date.date)}
                        >
                          <Calendar className="h-5 w-5 mb-1" />
                          <span className="font-medium">{date.date}</span>
                          <span className="text-sm text-muted-foreground">{date.day}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedDate && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Select a Time</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {selectedDateObj?.slots.map((time) => (
                          <button
                            key={time}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${
                              selectedTime === time ? "border-primary bg-primary/10" : "hover:border-primary/50"
                            }`}
                            onClick={() => handleTimeSelect(time)}
                          >
                            <Clock className="h-4 w-4" />
                            <span>{time}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Session Type</Label>
                    <RadioGroup
                      defaultValue={sessionType}
                      onValueChange={setSessionType}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="video" id="video" />
                        <Label htmlFor="video">Video Session</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="audio" id="audio" />
                        <Label htmlFor="audio">Audio Only</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="duration">Session Duration</Label>
                    <Select defaultValue={sessionDuration} onValueChange={setSessionDuration}>
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="50">50 minutes (Standard)</SelectItem>
                        <SelectItem value="80">80 minutes (Extended)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="notes">Notes for Therapist (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Share any information that might be helpful for your therapist to know before the session"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="rounded-lg border p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Appointment Details</h3>
                      <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                        Edit
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{selectedDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{selectedTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Session Type</p>
                        <p className="font-medium">{sessionType === "video" ? "Video Session" : "Audio Only"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{sessionDuration} minutes</p>
                      </div>
                    </div>

                    {notes && (
                      <div>
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p className="text-sm">{notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-4">Payment Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Session Fee</span>
                        <span>$120.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance Coverage</span>
                        <span>-$90.00</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Your Cost</span>
                        <span>$30.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm">
                      By confirming this appointment, you agree to MindConnect's cancellation policy. You may cancel or
                      reschedule up to 24 hours before your appointment without charge.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <Link href="/patient/therapists">Cancel</Link>
                </Button>
              )}

              {step < 3 ? (
                <Button onClick={handleContinue} disabled={step === 1 && (!selectedDate || !selectedTime)}>
                  Continue
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/patient/dashboard">Confirm Booking</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Therapist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-2">
                  <AvatarImage src={therapist.avatar} alt={therapist.name} />
                  <AvatarFallback>
                    {therapist.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-medium">{therapist.name}</h3>
                <p className="text-sm text-muted-foreground">{therapist.specialty}</p>
                <div className="flex items-center justify-center mt-2">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-medium">{therapist.rating}</span>
                  <span className="text-muted-foreground text-xs ml-1">({therapist.reviewCount})</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-1">About</h4>
                <p className="text-sm">{therapist.bio}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/patient/therapist/${therapist.id}`}>View Full Profile</Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-4 rounded-lg border p-4 flex items-center gap-3">
            <CalendarCheck className="h-10 w-10 text-primary" />
            <div>
              <h3 className="font-medium">Need Help?</h3>
              <p className="text-sm text-muted-foreground">Contact our support team for assistance with scheduling</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
