"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { moodService } from "@/lib/services/mood-service"
import { format, parseISO } from "date-fns"

type MoodEntry = {
  id: string
  user_id: string
  mood_level: number
  note: string | null
  recorded_at: string
}

export function MoodTracker() {
  const { userDetails } = useAuth()
  const [moodData, setMoodData] = useState<MoodEntry[]>([])
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMoodData = async () => {
      if (!userDetails?.id) return

      try {
        setIsLoading(true)
        const data = await moodService.getMoodEntries(userDetails.id)
        setMoodData(data)
      } catch (error) {
        console.error("Error fetching mood data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMoodData()
  }, [userDetails?.id])

  const handleMouseEnter = (data: any) => {
    setSelectedDay(data.id)
  }

  const handleMouseLeave = () => {
    setSelectedDay(null)
  }

  // Transform data for chart
  const chartData = moodData.map((entry) => ({
    id: entry.id,
    day: format(parseISO(entry.recorded_at), "EEE"),
    date: format(parseISO(entry.recorded_at), "MMM d"),
    mood: entry.mood_level,
    note: entry.note || "No note recorded",
  }))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>Low</div>
        <div>Mood Level</div>
        <div>High</div>
      </div>

      {isLoading ? (
        <div className="h-[180px] flex items-center justify-center">
          <p className="text-muted-foreground">Loading mood data...</p>
        </div>
      ) : chartData.length > 0 ? (
        <ChartContainer
          config={{
            mood: {
              label: "Mood",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[180px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              onMouseLeave={handleMouseLeave}
            >
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} axisLine={false} tickLine={false} tick={false} />
              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="var(--color-mood)"
                strokeWidth={3}
                dot={(props) => {
                  const { cx, cy, payload } = props
                  const isSelected = payload.id === selectedDay

                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : 4}
                      fill={isSelected ? "#9333ea" : "#d8b4fe"}
                      stroke={isSelected ? "#7e22ce" : "#c084fc"}
                      strokeWidth={2}
                      onMouseEnter={() => handleMouseEnter(payload)}
                      style={{ cursor: "pointer" }}
                    />
                  )
                }}
                activeDot={{ r: 8, fill: "#9333ea", stroke: "#7e22ce", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      ) : (
        <div className="h-[180px] flex items-center justify-center">
          <p className="text-muted-foreground">No mood data available. Start tracking your mood!</p>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        {selectedDay
          ? `${chartData.find((d) => d.id === selectedDay)?.date}: ${chartData.find((d) => d.id === selectedDay)?.note}`
          : "Hover over points to see details"}
      </div>

      <Button className="w-full btn-gradient-blue">Log Today's Mood</Button>
    </div>
  )
}
