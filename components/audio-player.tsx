"use client"

import { useState } from "react"
import { Pause, Play, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface AudioPlayerProps {
  track: {
    id: string
    title: string
    duration: string
    cover: string
  }
}

export function AudioPlayer({ track }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(70)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
      <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
        <img src={track.cover || "/placeholder.svg"} alt={track.title} className="object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium truncate">{track.title}</h3>
          <span className="text-xs text-muted-foreground">{track.duration}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-amber-700 dark:text-amber-300 hover:text-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-amber-700 dark:text-amber-300 hover:text-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>

          <Slider
            value={[volume]}
            max={100}
            step={1}
            className="w-20 h-1.5"
            onValueChange={(value) => setVolume(value[0])}
          />
        </div>
      </div>
    </div>
  )
}
