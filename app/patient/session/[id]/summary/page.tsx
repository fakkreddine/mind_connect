"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  FileText,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Video,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock session data
const sessionData = {
  id: "2",
  therapist: {
    name: "Dr. Sarah Johnson",
    avatar: "/placeholder.svg?height=80&width=80",
    specialty: "Cognitive Behavioral Therapy",
  },
  date: new Date(2025, 4, 8, 15, 0), // May 8, 2025, 3:00 PM
  duration: 50,
  status: "completed",
  summary: `
    In today's session, we focused on anxiety management techniques. We discussed how your anxiety has been affecting your daily life, particularly at work and in social situations.

    We practiced mindfulness exercises, including deep breathing and grounding techniques. You reported feeling calmer after these exercises and expressed interest in incorporating them into your daily routine.

    We also identified some cognitive distortions that may be contributing to your anxiety, particularly catastrophizing and black-and-white thinking. We began working on cognitive restructuring to challenge these thoughts.
  `,
  keyPoints: [
    "Practiced mindfulness and deep breathing exercises",
    "Identified cognitive distortions: catastrophizing and black-and-white thinking",
    "Began cognitive restructuring techniques",
    "Discussed work-related stressors and potential coping strategies",
  ],
  homework: [
    "Practice mindfulness exercises for 10 minutes daily",
    "Complete thought record worksheet for anxious thoughts",
    "Try progressive muscle relaxation before bed to improve sleep",
  ],
  nextSteps:
    "In our next session, we'll review your thought records and continue working on cognitive restructuring. We'll also explore additional relaxation techniques.",
  resources: [
    { title: "Mindfulness Meditation Guide", type: "PDF" },
    { title: "Thought Record Worksheet", type: "PDF" },
    { title: "Progressive Muscle Relaxation Audio", type: "Audio" },
  ],
  transcript: [
    {
      id: "1",
      speaker: "Dr. Sarah Johnson",
      text: "Hello John, how have you been feeling since our last session?",
      timestamp: "00:01:15",
    },
    {
      id: "2",
      speaker: "You",
      text: "I've been having more anxiety at work this week. There's a big project deadline coming up.",
      timestamp: "00:01:30",
    },
    {
      id: "3",
      speaker: "Dr. Sarah Johnson",
      text: "I understand. Work stress can definitely trigger anxiety. Let's talk about some techniques that might help you manage this specific situation.",
      timestamp: "00:01:45",
    },
    // More transcript entries would be here
  ],
}

export default function SessionSummaryPage({ params }: { params: { id: string } }) {
  const [feedback, setFeedback] = useState("")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      // In a real app, you would send the feedback to the server
      console.log("Submitting feedback:", feedback)
      setFeedbackSubmitted(true)
    }
  }

  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/patient/sessions">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Session Summary</h1>
          <p className="text-muted-foreground">Review your therapy session details</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={sessionData.therapist.avatar} alt={sessionData.therapist.name} />
                    <AvatarFallback>
                      {sessionData.therapist.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{sessionData.therapist.name}</CardTitle>
                    <CardDescription>{sessionData.therapist.specialty}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="badge-green">
                  {sessionData.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{format(sessionData.date, "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {format(sessionData.date, "h:mm a")} ({sessionData.duration} min)
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Session Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="summary">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="transcript">Transcript</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="pt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Session Summary</h3>
                    <div className="whitespace-pre-line text-sm">{sessionData.summary}</div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Key Points</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {sessionData.keyPoints.map((point, index) => (
                        <li key={index} className="text-sm">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Homework</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {sessionData.homework.map((item, index) => (
                        <li key={index} className="text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Next Steps</h3>
                    <p className="text-sm">{sessionData.nextSteps}</p>
                  </div>
                </TabsContent>
                <TabsContent value="transcript" className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Session Transcript</h3>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  <Card className="border-dashed">
                    <CardContent className="p-0">
                      <ScrollArea className="h-[400px]">
                        <div className="p-4 space-y-4">
                          {sessionData.transcript.map((entry) => (
                            <div key={entry.id} className="flex gap-3">
                              <div className="flex-shrink-0 w-20 text-xs text-muted-foreground pt-1">
                                {entry.timestamp}
                              </div>
                              <div className="flex-1">
                                <div
                                  className={`font-medium text-sm ${
                                    entry.speaker === "You" ? "text-blue-600" : "text-purple-600"
                                  }`}
                                >
                                  {entry.speaker}
                                </div>
                                <p className="text-sm">{entry.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="resources" className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Session Resources</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {sessionData.resources.map((resource, index) => (
                      <Card key={index} className="overflow-hidden">
                        <div
                          className={`p-2 text-white ${
                            resource.type === "PDF"
                              ? "bg-red-600"
                              : resource.type === "Audio"
                                ? "bg-purple-600"
                                : "bg-blue-600"
                          }`}
                        >
                          <div className="text-xs font-medium">{resource.type}</div>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium">{resource.title}</h4>
                          <div className="flex justify-end mt-2">
                            <Button variant="outline" size="sm" className="gap-1.5">
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Session Feedback
              </CardTitle>
              <CardDescription>Share your thoughts about this session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!feedbackSubmitted ? (
                <>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1 flex-col gap-2 h-auto py-4 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950/20 dark:hover:text-green-300"
                    >
                      <ThumbsUp className="h-6 w-6" />
                      <span>Helpful</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1 flex-col gap-2 h-auto py-4 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/20 dark:hover:text-red-300"
                    >
                      <ThumbsDown className="h-6 w-6" />
                      <span>Not Helpful</span>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Additional Comments</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Share your thoughts about this session..."
                      rows={4}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>
                  <Button className="w-full btn-gradient-blue" onClick={handleSubmitFeedback}>
                    Submit Feedback
                  </Button>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-3 mx-auto w-fit mb-4">
                    <ThumbsUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium">Thank You!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your feedback helps improve your therapy experience.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full btn-gradient-blue" asChild>
                <Link href="/patient/book">Book Next Session</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/patient/messages?therapist=${sessionData.therapist.name}`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Therapist
                </Link>
              </Button>
              <Button variant="outline" className="w-full">
                <Video className="mr-2 h-4 w-4" />
                View Recording
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Label component
function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  )
}
