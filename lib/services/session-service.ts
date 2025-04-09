import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/database.types"

type Session = Database["public"]["Tables"]["sessions"]["Row"]
type NewSession = Database["public"]["Tables"]["sessions"]["Insert"]
type SessionUpdate = Database["public"]["Tables"]["sessions"]["Update"]

export const sessionService = {
  async getUpcomingSessions(userId: string, userType: "patient" | "therapist"): Promise<Session[]> {
    const supabase = createClient()

    const column = userType === "patient" ? "patient_id" : "therapist_id"

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq(column, userId)
      .gte("scheduled_at", new Date().toISOString())
      .in("status", ["scheduled", "confirmed"])
      .order("scheduled_at", { ascending: true })

    if (error) {
      console.error("Error fetching upcoming sessions:", error)
      throw error
    }

    return data || []
  },

  async getPastSessions(userId: string, userType: "patient" | "therapist", limit = 10): Promise<Session[]> {
    const supabase = createClient()

    const column = userType === "patient" ? "patient_id" : "therapist_id"

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq(column, userId)
      .lt("scheduled_at", new Date().toISOString())
      .eq("status", "completed")
      .order("scheduled_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching past sessions:", error)
      throw error
    }

    return data || []
  },

  async getSessionById(sessionId: string): Promise<Session> {
    const supabase = createClient()

    const { data, error } = await supabase.from("sessions").select("*").eq("id", sessionId).single()

    if (error) {
      console.error("Error fetching session:", error)
      throw error
    }

    return data
  },

  async createSession(session: NewSession): Promise<Session> {
    const supabase = createClient()

    const { data, error } = await supabase.from("sessions").insert(session).select().single()

    if (error) {
      console.error("Error creating session:", error)
      throw error
    }

    return data
  },

  async updateSession(sessionId: string, updates: SessionUpdate): Promise<Session> {
    const supabase = createClient()

    const { data, error } = await supabase.from("sessions").update(updates).eq("id", sessionId).select().single()

    if (error) {
      console.error("Error updating session:", error)
      throw error
    }

    return data
  },
}
