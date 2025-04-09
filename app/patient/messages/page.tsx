"use client"

import { useState } from "react"
import { format } from "date-fns"
import { MessageSquare, PaperclipIcon, Search, Send, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MotivationalQuote } from "@/components/motivational-quote"

// Mock data for conversations
const conversations = [
  {
    id: "1",
    therapist: {
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      specialty: "Cognitive Behavioral Therapy",
    },
    lastMessage: "How have you been feeling since our last session?",
    timestamp: new Date(2025, 4, 14, 15, 30), // May 14, 2025, 3:30 PM
    unread: true,
  },
  {
    id: "2",
    therapist: {
      name: "Dr. Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      specialty: "Psychodynamic Therapy",
    },
    lastMessage: "I've shared some resources for you to review before our next appointment.",
    timestamp: new Date(2025, 4, 12, 10, 15), // May 12, 2025, 10:15 AM
    unread: false,
  },
  {
    id: "3",
    therapist: {
      name: "Dr. Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      specialty: "Mindfulness-Based Therapy",
    },
    lastMessage: "Remember to practice the breathing exercises we discussed.",
    timestamp: new Date(2025, 4, 10, 14, 0), // May 10, 2025, 2:00 PM
    unread: false,
  },
]

// Mock data for messages in a conversation
const messages = [
  {
    id: "1",
    sender: "therapist",
    text: "Hello John, how have you been feeling since our last session?",
    timestamp: new Date(2025, 4, 14, 15, 0), // May 14, 2025, 3:00 PM
  },
  {
    id: "2",
    sender: "patient",
    text: "Hi Dr. Johnson, I've been doing better. The mindfulness exercises have been helping with my anxiety.",
    timestamp: new Date(2025, 4, 14, 15, 10), // May 14, 2025, 3:10 PM
  },
  {
    id: "3",
    sender: "therapist",
    text: "That's great to hear! Have you been experiencing any challenges with the exercises?",
    timestamp: new Date(2025, 4, 14, 15, 15), // May 14, 2025, 3:15 PM
  },
  {
    id: "4",
    sender: "patient",
    text: "Sometimes I find it hard to stay focused, especially when I'm feeling particularly anxious.",
    timestamp: new Date(2025, 4, 14, 15, 20), // May 14, 2025, 3:20 PM
  },
  {
    id: "5",
    sender: "therapist",
    text: "That's completely normal. Remember that mindfulness is a practice, and it's okay if your mind wanders. The key is to gently bring your attention back without judgment. How have you been sleeping lately?",
    timestamp: new Date(2025, 4, 14, 15, 30), // May 14, 2025, 3:30 PM
  },
]

export default function PatientMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, you would send the message to the server
      console.log("Sending message:", messageInput)
      setMessageInput("")
    }
  }

  const filteredConversations = conversations.filter((conversation) =>
    conversation.therapist.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container py-6 h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Communicate with your therapists</p>
        </div>

        <div className="flex flex-1 gap-6 h-[calc(100%-5rem)] min-h-[500px]">
          <Card className="w-1/3 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Conversations
              </CardTitle>
              <CardDescription>Your message history with therapists</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                <div className="space-y-1 p-2">
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                        selectedConversation.id === conversation.id
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.therapist.avatar} alt={conversation.therapist.name} />
                        <AvatarFallback>
                          {conversation.therapist.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{conversation.therapist.name}</h3>
                          <span className="text-xs text-muted-foreground">
                            {format(conversation.timestamp, "MMM d")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread && (
                        <Badge className="bg-blue-600 text-white h-2 w-2 rounded-full p-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={selectedConversation.therapist.avatar}
                          alt={selectedConversation.therapist.name}
                        />
                        <AvatarFallback>
                          {selectedConversation.therapist.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{selectedConversation.therapist.name}</CardTitle>
                        <CardDescription>{selectedConversation.therapist.specialty}</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                      <span className="sr-only">View profile</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.sender === "patient" ? "bg-blue-600 text-white" : "bg-accent dark:bg-accent/50"
                            }`}
                          >
                            <p>{message.text}</p>
                            <div
                              className={`text-xs mt-1 ${
                                message.sender === "patient" ? "text-blue-100" : "text-muted-foreground"
                              }`}
                            >
                              {format(message.timestamp, "h:mm a")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex items-end gap-2">
                    <Textarea
                      placeholder="Type a message..."
                      className="min-h-10 resize-none"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                        <PaperclipIcon className="h-5 w-5" />
                        <span className="sr-only">Attach file</span>
                      </Button>
                      <Button
                        className="rounded-full h-10 w-10 p-0 btn-gradient-blue"
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                      >
                        <Send className="h-5 w-5" />
                        <span className="sr-only">Send message</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="flex-1 flex items-center justify-center">
                <CardContent className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No conversation selected</h3>
                  <p className="text-muted-foreground">Select a conversation to start messaging</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <MotivationalQuote variant="purple" className="w-full" />
      </div>
    </div>
  )
}
