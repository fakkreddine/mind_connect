"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Brain, Lightbulb, MessageSquare, Mic, MicOff, Monitor, Phone, Video, VideoOff } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AIInsight } from "@/components/ai-insight"
import { LiveTranscript } from "@/components/live-transcript"

// Mock data
const sessionData = {
  id: "1",
  therapist: {
    name: "Dr. Sarah Johnson",
    avatar: "/placeholder.svg?height=80&width=80",
    specialty: "Cognitive Behavioral Therapy",
  },
  date: "May 15, 2025",
  time: "3:00 PM",
  duration: "50 minutes",
  status: "active",
}

// Mock AI insights
const aiInsights = [
  {
    id: "1",
    title: "Breathing Exercise",
    description: "Try this 4-7-8 breathing technique to help manage anxiety in the moment.",
    type: "exercise",
    timestamp: "15:23",
  },
  {
    id: "2",
    title: "Cognitive Restructuring",
    description: "Your therapist mentioned challenging negative thoughts. Here's a worksheet that might help.",
    type: "resource",
    timestamp: "23:45",
  },
  {
    id: "3",
    title: "Sleep Hygiene",
    description: "Based on your discussion about sleep issues, these sleep hygiene tips could be beneficial.",
    type: "resource",
    timestamp: "35:12",
  },
]

// Mock transcript data
const transcriptData = [
  {
    id: "1",
    speaker: "Dr. Sarah Johnson",
    text: "Hello John, it's good to see you today. How have you been since our last session?",
    timestamp: "00:15",
  },
  {
    id: "2",
    speaker: "You",
    text: "I've been doing okay. I tried the mindfulness exercises you suggested, and they helped a bit with my anxiety.",
    timestamp: "00:30",
  },
  {
    id: "3",
    speaker: "Dr. Sarah Johnson",
    text: "That's great to hear. Can you tell me more about when you practiced the exercises and how they helped?",
    timestamp: "00:45",
  },
  {
    id: "4",
    speaker: "You",
    text: "I tried them in the mornings before work, and also when I felt overwhelmed during the day. They helped me focus on my breathing instead of worrying thoughts.",
    timestamp: "01:10",
  },
  {
    id: "5",
    speaker: "Dr. Sarah Johnson",
    text: "That's excellent. Mindfulness can be a powerful tool for managing anxiety in the moment. Let's talk about some additional strategies you might find helpful.",
    timestamp: "01:30",
  },
]

export default function SessionPage({ params }: { params: { id: string } }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [chatMessages, setChatMessages] = useState<
    Array<{
      sender: string
      message: string
      timestamp: string
    }>
  >([])
  const [messageInput, setMessageInput] = useState("")
  const [transcript, setTranscript] = useState(transcriptData)
  const [insights, setInsights] = useState(aiInsights)
  const [sessionTime, setSessionTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate connection to video call
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Session timer
  useEffect(() => {
    if (isConnected && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isConnected])

  // Format session time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Simulate live transcript updates
  useEffect(() => {
    if (isConnected) {
      const transcriptInterval = setInterval(() => {
        // Simulate new transcript entries
        if (Math.random() > 0.7) {
          const newEntry = {
            id: `${transcript.length + 1}`,
            speaker: Math.random() > 0.5 ? "Dr. Sarah Johnson" : "You",
            text: "This is a simulated live transcript entry to demonstrate real-time transcription during the therapy session.",
            timestamp: formatTime(sessionTime),
          }
          setTranscript((prev) => [...prev, newEntry])
        }
      }, 5000)

      // Simulate new AI insights
      const insightInterval = setInterval(() => {
        if (Math.random() > 0.8) {
          const insightTypes = ["exercise", "resource", "technique"]
          const newInsight = {
            id: `${insights.length + 4}`,
            title: "New AI Insight",
            description: "This is a simulated AI insight based on the ongoing conversation in your therapy session.",
            type: insightTypes[Math.floor(Math.random() * insightTypes.length)],
            timestamp: formatTime(sessionTime),
          }
          setInsights((prev) => [...prev, newInsight])
        }
      }, 15000)

      return () => {
        clearInterval(transcriptInterval)
        clearInterval(insightInterval)
      }
    }
  }, [isConnected, sessionTime, transcript.length, insights.length])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (messageInput.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          sender: "You",
          message: messageInput,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      setMessageInput("")

      // Simulate therapist response
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: sessionData.therapist.name,
            message: "Thank you for sharing that. Let's explore this further.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ])
      }, 3000)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b bg-background p-4 sticky top-0 z-10">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="/patient/dashboard">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </a>
          </Button>
          <div>
            <h1 className="text-xl font-bold">Therapy Session</h1>
            <p className="text-sm text-muted-foreground">
              {sessionData.date} at {sessionData.time} ({sessionData.duration})
            </p>
          </div>
          <Badge
            variant="outline"
            className="ml-auto flex items-center gap-1.5 bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300 border-green-200 dark:border-green-800"
          >
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Session
          </Badge>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono">
              {formatTime(sessionTime)}
            </Badge>
            <Button variant="destructive" size="sm">
              <Phone className="mr-2 h-4 w-4" />
              End Call
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="container py-6 h-full flex flex-col">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 flex flex-col">
                <div className="relative bg-muted rounded-lg overflow-hidden flex-1 flex items-center justify-center">
                  {!isConnected ? (
                    <div className="text-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-lg font-medium">Connecting to your session...</p>
                      <p className="text-sm text-muted-foreground">This may take a few moments</p>
                    </div>
                  ) : (
                    <>
                      {isVideoEnabled ? (
                        <div className="absolute inset-0 bg-black flex items-center justify-center">
                          <Avatar className="h-32 w-32">
                            <AvatarImage src={sessionData.therapist.avatar} alt={sessionData.therapist.name} />
                            <AvatarFallback>SJ</AvatarFallback>
                          </Avatar>
                          <div className="absolute bottom-4 right-4 w-32 h-24 bg-muted rounded-lg overflow-hidden border-2 border-background shadow-lg">
                            {/* Patient's video (self view) */}
                            <div className="w-full h-full bg-black flex items-center justify-center">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="You" />
                                <AvatarFallback>JP</AvatarFallback>
                              </Avatar>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <VideoOff className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-lg font-medium">Video is turned off</p>
                          <p className="text-sm text-muted-foreground">Click the video button to enable your camera</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center justify-center gap-4 p-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className={!isAudioEnabled ? "bg-destructive text-destructive-foreground" : ""}
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  >
                    {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    <span className="sr-only">{isAudioEnabled ? "Disable" : "Enable"} microphone</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={!isVideoEnabled ? "bg-destructive text-destructive-foreground" : ""}
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  >
                    {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    <span className="sr-only">{isVideoEnabled ? "Disable" : "Enable"} video</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Monitor className="h-5 w-5" />
                    <span className="sr-only">Share screen</span>
                  </Button>
                </div>
              </div>

              <div className="h-full">
                <Tabs defaultValue="transcript" className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="transcript">Transcript</TabsTrigger>
                    <TabsTrigger value="insights">AI Insights</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                  </TabsList>

                  <TabsContent value="transcript" className="flex-1 flex flex-col">
                    <Card className="flex-1 flex flex-col">
                      <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            Live Transcript
                            <Badge
                              variant="outline"
                              className="ml-2 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                            >
                              Live
                            </Badge>
                          </CardTitle>
                          <CardDescription>Real-time transcription of your session</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-hidden p-0">
                        <LiveTranscript transcript={transcript} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="insights" className="flex-1 flex flex-col">
                    <Card className="flex-1 flex flex-col">
                      <CardHeader className="py-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Brain className="h-5 w-5 text-purple-600" />
                          AI Insights
                        </CardTitle>
                        <CardDescription>Helpful resources based on your conversation</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-auto p-4 space-y-4">
                        {insights.length > 0 ? (
                          <div className="space-y-4">
                            {insights.map((insight) => (
                              <AIInsight key={insight.id} insight={insight} />
                            ))}
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-center p-4">
                            <div>
                              <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-muted-foreground">No insights yet</p>
                              <p className="text-xs text-muted-foreground">
                                Insights will appear as your session progresses
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="chat" className="flex-1 flex flex-col">
                    <Card className="flex-1 flex flex-col">
                      <CardHeader className="py-3">
                        <CardTitle className="text-lg">Session Chat</CardTitle>
                        <CardDescription>Message your therapist during the session</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-auto p-4 space-y-4">
                        {chatMessages.length > 0 ? (
                          chatMessages.map((msg, index) => (
                            <div
                              key={index}
                              className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  msg.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-xs">{msg.sender}</span>
                                  <span className="text-xs opacity-70">{msg.timestamp}</span>
                                </div>
                                <p>{msg.message}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="h-full flex items-center justify-center text-center p-4">
                            <div>
                              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-muted-foreground">No messages yet</p>
                              <p className="text-xs text-muted-foreground">Send a message to start the conversation</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <div className="p-4 border-t">
                        <form onSubmit={sendMessage} className="flex gap-2">
                          <Textarea
                            placeholder="Type a message..."
                            className="min-h-10 resize-none"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                          />
                          <Button type="submit">Send</Button>
                        </form>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
