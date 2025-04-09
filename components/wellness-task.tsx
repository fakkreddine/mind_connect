import { Button } from "@/components/ui/button"
import { BookOpen, Footprints, TreesIcon as Lungs } from "lucide-react"

interface WellnessTaskProps {
  task: {
    id: string
    title: string
    description: string
    duration: string
    icon: string
  }
}

export function WellnessTask({ task }: WellnessTaskProps) {
  // Map icon string to component
  const IconComponent = () => {
    switch (task.icon) {
      case "breathing":
        return <Lungs className="h-5 w-5 text-teal-600 dark:text-teal-400" />
      case "journal":
        return <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      case "walking":
        return <Footprints className="h-5 w-5 text-green-600 dark:text-green-400" />
      default:
        return <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    }
  }

  // Get background color based on icon
  const getBgColor = () => {
    switch (task.icon) {
      case "breathing":
        return "bg-teal-50 dark:bg-teal-950/20"
      case "journal":
        return "bg-emerald-50 dark:bg-emerald-950/20"
      case "walking":
        return "bg-green-50 dark:bg-green-950/20"
      default:
        return "bg-emerald-50 dark:bg-emerald-950/20"
    }
  }

  return (
    <div className={`rounded-lg p-4 ${getBgColor()}`}>
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-white dark:bg-gray-800 p-2 mt-1">
          <IconComponent />
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="font-medium">{task.title}</h3>
          <p className="text-sm text-muted-foreground">{task.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full">{task.duration}</span>
            <Button size="sm" variant="outline">
              Start
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
