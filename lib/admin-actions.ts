"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateUserRole(userId: string, newRole: "user" | "admin" | "moderator") {
  const supabase = createClient()

  // Check if current user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data: currentUserProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (currentUserProfile?.role !== "admin") {
    return { error: "Only admins can change user roles" }
  }

  const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

  if (error) {
    return { error: "Failed to update user role" }
  }

  revalidatePath("/admin/users")
  return { success: true }
}

export async function approveModerationItem(itemId: string, notes?: string) {
  const supabase = createClient()

  // Check if current user is admin/moderator
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return { error: "Insufficient permissions" }
  }

  const { error } = await supabase
    .from("moderation_queue")
    .update({
      status: "approved",
      moderator_id: user.id,
      moderator_notes: notes,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", itemId)

  if (error) {
    return { error: "Failed to approve item" }
  }

  revalidatePath("/admin/moderation")
  return { success: true }
}

export async function rejectModerationItem(itemId: string, notes?: string) {
  const supabase = createClient()

  // Check if current user is admin/moderator
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return { error: "Insufficient permissions" }
  }

  const { error } = await supabase
    .from("moderation_queue")
    .update({
      status: "rejected",
      moderator_id: user.id,
      moderator_notes: notes,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", itemId)

  if (error) {
    return { error: "Failed to reject item" }
  }

  revalidatePath("/admin/moderation")
  return { success: true }
}

export async function deleteWikiPageAdmin(pageId: string) {
  const supabase = createClient()

  // Check if current user is admin/moderator
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return { error: "Insufficient permissions" }
  }

  const { error } = await supabase.from("wiki_pages").delete().eq("id", pageId)

  if (error) {
    return { error: "Failed to delete page" }
  }

  revalidatePath("/admin")
  revalidatePath("/")
  return { success: true }
}
