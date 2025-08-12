import { createClient } from "@/lib/supabase/server"

export interface WikiPage {
  id: string
  title: string
  slug: string
  content: string
  summary?: string
  author_id?: string
  status: "draft" | "published" | "pending_review" | "archived"
  version: number
  created_at: string
  updated_at: string
  profiles?: {
    full_name?: string
    email: string
  }
}

export interface PageRevision {
  id: string
  page_id: string
  title: string
  content: string
  summary?: string
  author_id?: string
  version: number
  created_at: string
  profiles?: {
    full_name?: string
    email: string
  }
}

export async function getWikiPage(slug: string): Promise<WikiPage | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("wiki_pages")
    .select(`
      *,
      profiles (
        full_name,
        email
      )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error || !data) {
    return null
  }

  return data as WikiPage
}

export async function getAllWikiPages(): Promise<WikiPage[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("wiki_pages")
    .select(`
      *,
      profiles (
        full_name,
        email
      )
    `)
    .eq("status", "published")
    .order("updated_at", { ascending: false })

  if (error) {
    return []
  }

  return data as WikiPage[]
}

export async function getPageRevisions(pageId: string): Promise<PageRevision[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("page_revisions")
    .select(`
      *,
      profiles (
        full_name,
        email
      )
    `)
    .eq("page_id", pageId)
    .order("version", { ascending: false })

  if (error) {
    return []
  }

  return data as PageRevision[]
}

export async function searchWikiPages(query: string): Promise<WikiPage[]> {
  const supabase = createClient()

  if (!query.trim()) {
    return []
  }

  const { data, error } = await supabase
    .from("wiki_pages")
    .select(`
      *,
      profiles (
        full_name,
        email
      )
    `)
    .eq("status", "published")
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order("updated_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("Search error:", error)
    return []
  }

  return data as WikiPage[]
}

export async function advancedSearchWikiPages(
  query: string,
  author?: string,
  dateFrom?: string,
  dateTo?: string,
): Promise<WikiPage[]> {
  const supabase = createClient()

  if (!query.trim()) {
    return []
  }

  let queryBuilder = supabase
    .from("wiki_pages")
    .select(`
      *,
      profiles (
        full_name,
        email
      )
    `)
    .eq("status", "published")
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)

  if (author) {
    queryBuilder = queryBuilder.ilike("profiles.full_name", `%${author}%`)
  }

  if (dateFrom) {
    queryBuilder = queryBuilder.gte("created_at", dateFrom)
  }

  if (dateTo) {
    queryBuilder = queryBuilder.lte("created_at", dateTo)
  }

  const { data, error } = await queryBuilder.order("updated_at", { ascending: false }).limit(100)

  if (error) {
    console.error("Advanced search error:", error)
    return []
  }

  return data as WikiPage[]
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}
