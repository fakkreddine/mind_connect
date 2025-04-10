"use client"

import type * as React from "react"
import { useRef, useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bot, Send, X, ChevronDown, Loader2, FileText, Calendar, Brain, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

// Mock previous therapy sessions data for the AI to reference
const mockSessionHistory = [
  {
    id: "session-1",
    date: "May 8, 2025",
    summary: "Discussed anxiety management techniques and practiced mindfulness exercises.",
    keyPoints: [
      "Introduced 4-7-8 breathing technique",
      "Identified work-related stress triggers",
      "Started journaling practice",
    ],
  },
  {
    id: "session-2",
    date: "May 1, 2025",
    summary: "Initial assessment. Discussed therapy goals and background history.",
    keyPoints: [
      "Set therapy goals: reduce anxiety, improve sleep",
      "Reviewed sleep hygiene practices",
      "Discussed family history",
    ],
  },
]

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// Simulated AI response function with some context awareness
const getAIResponse = (message: string): Promise<string> => {
  // Convert message to lowercase for easier matching
  const messageLower = message.toLowerCase()

  // Wait to simulate AI thinking
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check for different types of queries and provide appropriate responses
      if (messageLower.includes("session") && (messageLower.includes("last") || messageLower.includes("previous"))) {
        resolve(`In your last session on ${mockSessionHistory[0].date}, you discussed ${mockSessionHistory[0].summary} Some key points were:
        
• ${mockSessionHistory[0].keyPoints[0]}
• ${mockSessionHistory[0].keyPoints[1]}
• ${mockSessionHistory[0].keyPoints[2]}

Would you like me to go over any of these points in more detail?`)
      } else if (messageLower.includes("breathing") || messageLower.includes("technique")) {
        resolve(`The 4-7-8 breathing technique that your therapist recommended works like this:

1. Exhale completely through your mouth
2. Close your mouth and inhale through your nose for 4 seconds
3. Hold your breath for 7 seconds
4. Exhale completely through your mouth for 8 seconds
5. Repeat this cycle 4 times

Would you like to try a guided breathing exercise now?`)
      } else if (messageLower.includes("next") && messageLower.includes("appointment")) {
        resolve(`Your next appointment with Dr. Sarah Johnson is scheduled for:

Date: May 15, 2025
Time: 3:00 PM
Duration: 50 minutes

Would you like me to send you a reminder notification before the session?`)
      } else if (messageLower.includes("progress") || messageLower.includes("doing")) {
        resolve(`Based on your therapist's notes and your self-assessments, you've been making steady progress! 

• Your anxiety symptoms have decreased by approximately 20% since starting therapy
• Your sleep quality score has improved from 5.2 to 6.8 (out of 10)
• You've completed 8 of the 10 recommended daily mindfulness exercises

Keep up the great work! Is there any specific area you'd like more focused help with?`)
      } else if (messageLower.includes("sleep") || messageLower.includes("insomnia")) {
        resolve(`Here are the sleep hygiene tips your therapist recommended:

1. Maintain a consistent sleep schedule
2. Create a relaxing bedtime routine
3. Limit screen time 1 hour before bed
4. Keep your bedroom cool, dark, and quiet
5. Avoid caffeine after 2pm
6. Try the progressive muscle relaxation technique before sleeping

Would you like me to explain any of these in more detail?`)
      } else if (messageLower.includes("hello") || messageLower.includes("hi") || messageLower.includes("hey")) {
        resolve(`Hello! I'm your MindConnect assistant. I'm here to help with your therapy journey. I can:

• Remind you of past session notes
• Help with therapy exercises
• Answer questions about techniques
• Track your progress
• Provide appointment information

What can I help you with today?`)
      } else {
        resolve(`Thank you for sharing that. While I'm here to support your therapy journey, I think this would be valuable to discuss with Dr. Sarah Johnson in your next session on May 15. 

In the meantime, would you like to:
• Review techniques from previous sessions
• Practice a guided mindfulness exercise
• Check your progress tracker
• See your upcoming appointments`)
      }
    }, 1000)
  })
}

export function AIChatbot() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi ${user?.name || "there"}! I'm your MindConnect assistant. How can I help with your therapy journey today?`,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Get AI response
    try {
      const response = await getAIResponse(inputValue)

      // Add AI response
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)

      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "I'm sorry, I couldn't process your request. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const renderMessageContent = (content: string) => {
    // Split content by newlines and render each part
    return content.split("\n").map((line, i) => {
      // Check if line is a bullet point
      if (line.trim().startsWith("•")) {
        return (
          <div key={i} className="flex items-start gap-2 my-1">
            <div className="rounded-full bg-primary/20 p-1 mt-1 h-2 w-2" />
            <span>{line.trim().substring(1)}</span>
          </div>
        )
      }
      // Check if line is a numbered step
      else if (/^\d+\./.test(line.trim())) {
        return (
          <div key={i} className="flex items-start gap-2 my-1">
            <div className="rounded-full bg-primary/20 p-1 mt-1 flex items-center justify-center h-5 w-5 text-xs">
              {line.trim().split(".")[0]}
            </div>
            <span>{line.trim().substring(line.trim().indexOf(".") + 1)}</span>
          </div>
        )
      }
      // Regular text line
      else if (line.trim()) {
        return (
          <p key={i} className="my-1">
            {line}
          </p>
        )
      }
      // Empty line - render a spacer
      return <div key={i} className="h-2" />
    })
  }

  // Mobile version uses Sheet component
  const MobileChatbot = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full h-14 w-14 fixed bottom-6 right-6 shadow-lg btn-healing z-50 animate-pulse-gentle"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] p-0 rounded-t-xl">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            MindConnect Assistant
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3 animate-fadeIn",
                  message.role === "user" ? "flex-row-reverse" : "",
                )}
              >
                {message.role === "assistant" ? (
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar>
                    <AvatarImage src={user?.avatar || "/placeholder.svg?height=40&width=40"} />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-lg p-3 max-w-[80%]",
                    message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground",
                  )}
                >
                  <div className="text-sm">{renderMessageContent(message.content)}</div>
                  <div
                    className={cn(
                      "text-xs mt-1",
                      message.role === "assistant" ? "text-muted-foreground" : "text-primary-foreground/80",
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 bg-muted">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="min-h-10 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(e)
                  }
                }}
              />
              <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  // Desktop version is a floating card
  const DesktopChatbot = () => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-20 right-6 z-50 w-80 sm:w-96"
        >
          <Card className="shadow-xl border overflow-hidden">
            <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 bg-card border-b">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <span className="font-medium">MindConnect Assistant</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMinimized(!isMinimized)}>
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", isMinimized ? "transform rotate-180" : "")}
                  />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardContent className="p-0">
                    <div className="h-96 overflow-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex items-start gap-3 animate-fadeIn",
                            message.role === "user" ? "flex-row-reverse" : "",
                          )}
                        >
                          {message.role === "assistant" ? (
                            <Avatar>
                              <AvatarImage src="/placeholder.svg?height=40&width=40" />
                              <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar>
                              <AvatarImage src={user?.avatar || "/placeholder.svg?height=40&width=40"} />
                              <AvatarFallback>You</AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={cn(
                              "rounded-lg p-3 max-w-[80%]",
                              message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground",
                            )}
                          >
                            <div className="text-sm">{renderMessageContent(message.content)}</div>
                            <div
                              className={cn(
                                "text-xs mt-1",
                                message.role === "assistant" ? "text-muted-foreground" : "text-primary-foreground/80",
                              )}
                            >
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                          </Avatar>
                          <div className="rounded-lg p-3 bg-muted">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 border-t">
                    <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
                      <Textarea
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="min-h-10 resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage(e)
                          }
                        }}
                      />
                      <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardFooter>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Mobile-first approach to rendering
  return (
    <>
      {/* Show mobile version on small screens */}
      <div className="sm:hidden">
        <MobileChatbot />
      </div>

      {/* Show desktop version on larger screens */}
      <div className="hidden sm:block">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            size="icon"
            className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg btn-healing animate-pulse-gentle z-50"
          >
            <Bot className="h-6 w-6" />
          </Button>
        )}
        <DesktopChatbot />
      </div>
    </>
  )
}

// Quick access buttons to show in different contexts
export function AIChatbotQuickActions() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-col gap-2 mt-4">
      <h3 className="text-sm font-medium">Quick Assistance</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="justify-start h-auto py-2" onClick={() => setIsOpen(true)}>
          <Calendar className="h-4 w-4 mr-2" />
          <span>Next Session</span>
        </Button>
        <Button variant="outline" size="sm" className="justify-start h-auto py-2" onClick={() => setIsOpen(true)}>
          <FileText className="h-4 w-4 mr-2" />
          <span>My Progress</span>
        </Button>
        <Button variant="outline" size="sm" className="justify-start h-auto py-2" onClick={() => setIsOpen(true)}>
          <Brain className="h-4 w-4 mr-2" />
          <span>Techniques</span>
        </Button>
        <Button variant="outline" size="sm" className="justify-start h-auto py-2" onClick={() => setIsOpen(true)}>
          <Sparkles className="h-4 w-4 mr-2" />
          <span>Exercises</span>
        </Button>
      </div>
    </div>
  )
}
