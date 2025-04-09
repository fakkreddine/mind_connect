"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TranscriptEntry {
  id: string
  speaker: string
  text: string
  timestamp: string
}

interface LiveTranscriptProps {
  transcript: TranscriptEntry[]
}

export function LiveTranscript({ transcript }: LiveTranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the bottom when new transcript entries are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [transcript])

  return (
    <ScrollArea className="h-full" ref={scrollRef}>
      <div className="p-4 space-y-4">
        {transcript.length > 0 ? (
          transcript.map((entry) => (
            <div key={entry.id} className="flex gap-3 animate-fadeIn">
              <div className="flex-shrink-0 mt-1">
                {entry.speaker === "You" ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
                    <AvatarFallback>JP</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Dr. Sarah Johnson" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium ${entry.speaker === "You" ? "text-blue-600 dark:text-blue-400" : "text-purple-600 dark:text-purple-400"}`}
                  >
                    {entry.speaker}
                  </span>
                  <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                </div>
                <p className="text-sm">{entry.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Transcript will appear here during the session</p>
          </div>
        )}

        {/* Live typing indicator */}
        <div className="flex gap-3 animate-pulse">
          <div className="flex-shrink-0 mt-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Dr. Sarah Johnson" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-purple-600 dark:text-purple-400">Dr. Sarah Johnson</span>
            </div>
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-purple-400 dark:bg-purple-600 animate-bounce"></div>
              <div className="h-2 w-2 rounded-full bg-purple-400 dark:bg-purple-600 animate-bounce [animation-delay:0.2s]"></div>
              <div className="h-2 w-2 rounded-full bg-purple-400 dark:bg-purple-600 animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
