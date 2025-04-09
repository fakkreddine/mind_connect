import { BookOpen, ExternalLink, Lightbulb, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AIInsightProps {
  insight: {
    id: string
    title: string
    description: string
    type: string
    timestamp: string
  }
}

export function AIInsight({ insight }: AIInsightProps) {
  // Get background color based on insight type
  const getBgColor = () => {
    switch (insight.type) {
      case "exercise":
        return "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
      case "resource":
        return "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800"
      case "technique":
        return "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
      default:
        return "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
    }
  }

  // Get icon based on insight type
  const getIcon = () => {
    switch (insight.type) {
      case "exercise":
        return <Play className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      case "resource":
        return <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
      case "technique":
        return <Lightbulb className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      default:
        return <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    }
  }

  return (
    <div className={`rounded-lg border p-4 ${getBgColor()}`}>
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-white dark:bg-gray-800 p-2 mt-1">{getIcon()}</div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{insight.title}</h3>
            <span className="text-xs text-muted-foreground">{insight.timestamp}</span>
          </div>
          <p className="text-sm">{insight.description}</p>
          <div className="flex justify-end">
            <Button size="sm" variant="outline" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
