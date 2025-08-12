"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { generateSlug } from "./wiki"

export async function createWikiPage(prevState: any, formData: FormData) {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: "You must be logged in to create pages" }
  }

  const title = formData.get("title")?.toString()
  const content = formData.get("content")?.toString()
  const summary = formData.get("summary")?.toString()

  if (!title || !content) {
    return { error: "Title and content are required" }
  }

  const slug = generateSlug(title)

  // Check if slug already exists
  const { data: existingPage } = await supabase.from("wiki_pages").select("id").eq("slug", slug).single()

  if (existingPage) {
    return { error: "A page with this title already exists" }
  }

  const { error } = await supabase.from("wiki_pages").insert({
    title,
    slug,
    content,
    summary,
    author_id: user.id,
    status: "published",
  })

  if (error) {
    return { error: "Failed to create page" }
  }

  revalidatePath("/")
  redirect(`/wiki/${slug}`)
}

export async function updateWikiPage(pageId: string, prevState: any, formData: FormData) {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: "You must be logged in to edit pages" }
  }

  const title = formData.get("title")?.toString()
  const content = formData.get("content")?.toString()
  const summary = formData.get("summary")?.toString()

  if (!title || !content) {
    return { error: "Title and content are required" }
  }

  // Get current page to check permissions
  const { data: currentPage } = await supabase.from("wiki_pages").select("author_id, slug").eq("id", pageId).single()

  if (!currentPage) {
    return { error: "Page not found" }
  }

  // Check if user can edit (author or admin/moderator)
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  const canEdit = currentPage.author_id === user.id || (profile && ["admin", "moderator"].includes(profile.role))

  if (!canEdit) {
    return { error: "You do not have permission to edit this page" }
  }

  const slug = generateSlug(title)

  // Check if new slug conflicts with existing page (excluding current page)
  if (slug !== currentPage.slug) {
    const { data: existingPage } = await supabase
      .from("wiki_pages")
      .select("id")
      .eq("slug", slug)
      .neq("id", pageId)
      .single()

    if (existingPage) {
      return { error: "A page with this title already exists" }
    }
  }

  const { error } = await supabase
    .from("wiki_pages")
    .update({
      title,
      slug,
      content,
      summary,
      updated_at: new Date().toISOString(),
    })
    .eq("id", pageId)

  if (error) {
    return { error: "Failed to update page" }
  }

  revalidatePath(`/wiki/${slug}`)
  revalidatePath("/")
  redirect(`/wiki/${slug}`)
}

export async function deleteWikiPage(pageId: string) {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: "You must be logged in to delete pages" }
  }

  // Check if user has permission (admin/moderator only)
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return { error: "You do not have permission to delete pages" }
  }

  const { error } = await supabase.from("wiki_pages").delete().eq("id", pageId)

  if (error) {
    return { error: "Failed to delete page" }
  }

  revalidatePath("/")
  redirect("/")
}
