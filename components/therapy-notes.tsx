"use client"

import { useState } from "react"
import { Lightbulb, PlusCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TherapyNotesProps {
  value: string
  onChange: (value: string) => void
  suggestions: string[]
  onUseSuggestion: (suggestion: string) => void
}

export function TherapyNotes({ value, onChange, suggestions, onUseSuggestion }: TherapyNotesProps) {
  const [showSuggestions, setShowSuggestions] = useState(true)

  return (
    <div className="flex flex-1 h-full">
      <div className={`flex-1 flex flex-col ${showSuggestions && suggestions.length > 0 ? "border-r" : ""}`}>
        <Textarea
          placeholder="Type your session notes here..."
          className="flex-1 resize-none rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-4"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="p-4 border-t flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Save Draft
            </Button>
            <Button size="sm">Complete Notes</Button>
          </div>
          {suggestions.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="gap-1.5"
                  >
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span>{showSuggestions ? "Hide" : "Show"} AI Suggestions</span>
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs text-amber-700">
                      {suggestions.length}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI-generated suggestions based on the session</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="w-80 flex flex-col">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <h3 className="font-medium text-sm">AI Suggestions</h3>
            </div>
            <span className="text-xs text-muted-foreground">Click to add to notes</span>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-3 text-sm hover:bg-amber-100 dark:hover:bg-amber-900/30 cursor-pointer transition-colors"
                  onClick={() => onUseSuggestion(suggestion)}
                >
                  <div className="flex items-start gap-2">
                    <PlusCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <p>{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
