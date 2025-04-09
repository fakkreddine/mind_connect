"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIChatbot() {
  const { userDetails } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi ${userDetails?.full_name?.split(" ")[0] || "there"}! I'm your MindConnect AI assistant. I can help you with therapy resources, answer questions about your sessions, or provide wellness tips. How can I help you today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  \
  =>
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  , [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(input)
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  // Simple AI response generator (would be replaced with actual API call)
  const generateAIResponse = (userInput: string): Message => {
    const userInputLower = userInput.toLowerCase()
    let responseContent = ""

    if (userInputLower.includes("session") || userInputLower.includes("appointment")) {
      responseContent =
        "Your next therapy session is scheduled for May 15, 2025 at 3:00 PM with Dr. Sarah Johnson. Would you like me to send you a reminder?"
    } else if (userInputLower.includes("anxious") || userInputLower.includes("anxiety")) {
      responseContent =
        "I'm sorry to hear you're feeling anxious. Have you tried the 4-7-8 breathing technique? Breathe in for 4 seconds, hold for 7 seconds, and exhale for 8 seconds. This can help calm your nervous system."
    } else if (userInputLower.includes("sleep") || userInputLower.includes("insomnia")) {
      responseContent =
        "Sleep issues can be challenging. Some tips that might help include maintaining a consistent sleep schedule, avoiding screens before bed, and creating a relaxing bedtime routine. Would you like more specific suggestions?"
    } else if (userInputLower.includes("resource") || userInputLower.includes("material")) {
      responseContent =
        "I can recommend several resources based on your therapy goals. The 'Mindfulness Techniques' guide in your resource library might be particularly helpful. Would you like me to share more resources?"
    } else if (userInputLower.includes("mood") || userInputLower.includes("feeling")) {
      responseContent =
        "Tracking your mood is a great way to identify patterns. I notice your mood has been improving over the past week. Keep using the mood tracker daily for the best insights."
    } else {
      responseContent =
        "Thank you for sharing that. Is there anything specific about your mental health journey you'd like to discuss or any questions you have about your therapy process?"
    }

    return {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseContent,
      timestamp: new Date(),
    }
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          MindConnect AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI Assistant" />
                    <AvatarFallback className="bg-blue-100 text-blue-700">AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 dark:bg-blue-900/20 text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-muted-foreground"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={userDetails?.avatar_url || "/placeholder.svg?height=32&width=32"}
                      alt={userDetails?.full_name || "User"}
                    />
                    <AvatarFallback>
                      {userDetails?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2"
          >
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full h-10 w-10 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
