import { createClient } from "@/lib/supabase/server"

export interface ModerationItem {
  id: string
  page_id?: string
  action_type: "create" | "edit" | "delete"
  proposed_title?: string
  proposed_content?: string
  proposed_summary?: string
  author_id?: string
  moderator_id?: string
  status: "pending" | "approved" | "rejected"
  moderator_notes?: string
  created_at: string
  reviewed_at?: string
  profiles?: {
    full_name?: string
    email: string
  }
  wiki_pages?: {
    title: string
    slug: string
  }
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  role: "user" | "admin" | "moderator"
  created_at: string
  updated_at: string
}

export async function getModerationQueue(): Promise<ModerationItem[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("moderation_queue")
    .select(`
      *,
      profiles!moderation_queue_author_id_fkey (
        full_name,
        email
      ),
      wiki_pages (
        title,
        slug
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching moderation queue:", error)
    return []
  }

  return data as ModerationItem[]
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data as UserProfile[]
}

export async function getWikiStats() {
  const supabase = createClient()

  const [pagesResult, usersResult, moderationResult] = await Promise.all([
    supabase.from("wiki_pages").select("status", { count: "exact" }),
    supabase.from("profiles").select("role", { count: "exact" }),
    supabase.from("moderation_queue").select("status", { count: "exact" }),
  ])

  const pageStats = {
    total: pagesResult.count || 0,
    published: 0,
    draft: 0,
    pending: 0,
    archived: 0,
  }

  if (pagesResult.data) {
    pagesResult.data.forEach((page) => {
      pageStats[page.status as keyof typeof pageStats]++
    })
  }

  const userStats = {
    total: usersResult.count || 0,
    admins: 0,
    moderators: 0,
    users: 0,
  }

  if (usersResult.data) {
    usersResult.data.forEach((user) => {
      if (user.role === "admin") userStats.admins++
      else if (user.role === "moderator") userStats.moderators++
      else userStats.users++
    })
  }

  const moderationStats = {
    total: moderationResult.count || 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  }

  if (moderationResult.data) {
    moderationResult.data.forEach((item) => {
      moderationStats[item.status as keyof typeof moderationStats]++
    })
  }

  return {
    pages: pageStats,
    users: userStats,
    moderation: moderationStats,
  }
}

export async function checkAdminPermissions(): Promise<boolean> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  return profile?.role === "admin" || profile?.role === "moderator"
}
