import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/database.types"

type MoodEntry = Database["public"]["Tables"]["mood_entries"]["Row"]
type NewMoodEntry = Database["public"]["Tables"]["mood_entries"]["Insert"]

export const moodService = {
  async getMoodEntries(userId: string, limit = 7): Promise<MoodEntry[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", userId)
      .order("recorded_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching mood entries:", error)
      throw error
    }

    return data || []
  },

  async addMoodEntry(entry: NewMoodEntry): Promise<MoodEntry> {
    const supabase = createClient()

    const { data, error } = await supabase.from("mood_entries").insert(entry).select().single()

    if (error) {
      console.error("Error adding mood entry:", error)
      throw error
    }

    return data
  },

  async getMoodTrends(userId: string, days = 30): Promise<MoodEntry[]> {
    const supabase = createClient()

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", userId)
      .gte("recorded_at", startDate.toISOString())
      .lte("recorded_at", endDate.toISOString())
      .order("recorded_at", { ascending: true })

    if (error) {
      console.error("Error fetching mood trends:", error)
      throw error
    }

    return data || []
  },
}
