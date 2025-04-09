"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Quote, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MotivationalQuoteProps {
  variant?: "blue" | "purple" | "green" | "teal"
  refreshable?: boolean
  className?: string
}

const quotes = [
  {
    quote: "You don't have to see the whole staircase, just take the first step.",
    author: "Martin Luther King Jr.",
  },
  {
    quote: "The way I see it, if you want the rainbow, you gotta put up with the rain.",
    author: "Dolly Parton",
  },
  {
    quote: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  {
    quote: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "Anonymous",
  },
  {
    quote: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
    author: "Anonymous",
  },
]

export function MotivationalQuote({ variant = "blue", refreshable = false, className }: MotivationalQuoteProps) {
  const [quoteIndex, setQuoteIndex] = useState(Math.floor(Math.random() * quotes.length))

  const getGradient = () => {
    switch (variant) {
      case "blue":
        return "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30"
      case "purple":
        return "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30"
      case "green":
        return "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30"
      case "teal":
        return "from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30"
      default:
        return "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30"
    }
  }

  const getIconColor = () => {
    switch (variant) {
      case "blue":
        return "text-blue-600 dark:text-blue-400"
      case "purple":
        return "text-purple-600 dark:text-purple-400"
      case "green":
        return "text-emerald-600 dark:text-emerald-400"
      case "teal":
        return "text-teal-600 dark:text-teal-400"
      default:
        return "text-blue-600 dark:text-blue-400"
    }
  }

  const getTextColor = () => {
    switch (variant) {
      case "blue":
        return "text-blue-800 dark:text-blue-300"
      case "purple":
        return "text-purple-800 dark:text-purple-300"
      case "green":
        return "text-emerald-800 dark:text-emerald-300"
      case "teal":
        return "text-teal-800 dark:text-teal-300"
      default:
        return "text-blue-800 dark:text-blue-300"
    }
  }

  const getSubtextColor = () => {
    switch (variant) {
      case "blue":
        return "text-blue-600 dark:text-blue-400"
      case "purple":
        return "text-purple-600 dark:text-purple-400"
      case "green":
        return "text-emerald-600 dark:text-emerald-400"
      case "teal":
        return "text-teal-600 dark:text-teal-400"
      default:
        return "text-blue-600 dark:text-blue-400"
    }
  }

  const getBgColor = () => {
    switch (variant) {
      case "blue":
        return "bg-blue-100 dark:bg-blue-900/50"
      case "purple":
        return "bg-purple-100 dark:bg-purple-900/50"
      case "green":
        return "bg-emerald-100 dark:bg-emerald-900/50"
      case "teal":
        return "bg-teal-100 dark:bg-teal-900/50"
      default:
        return "bg-blue-100 dark:bg-blue-900/50"
    }
  }

  const refreshQuote = () => {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * quotes.length)
    } while (newIndex === quoteIndex)
    setQuoteIndex(newIndex)
  }

  return (
    <Card className={cn(`bg-gradient-to-r ${getGradient()} border-none shadow-sm`, className)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`rounded-full ${getBgColor()} p-3`}>
            <Quote className={`h-6 w-6 ${getIconColor()}`} />
          </div>
          <div className="flex-1">
            <p className={`text-lg font-medium italic ${getTextColor()}`}>"{quotes[quoteIndex].quote}"</p>
            <div className="flex items-center justify-between mt-2">
              <p className={`text-sm ${getSubtextColor()}`}>— {quotes[quoteIndex].author}</p>
              {refreshable && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 rounded-full ${getSubtextColor()}`}
                  onClick={refreshQuote}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="sr-only">New quote</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
