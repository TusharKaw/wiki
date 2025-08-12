import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Plus, Search, Settings } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/lib/actions"
import { getAllWikiPages } from "@/lib/wiki"
import PageList from "@/components/wiki/page-list"
import SearchBar from "@/components/wiki/search-bar"

export default async function Home() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const pages = await getAllWikiPages()

  // Check if user is admin/moderator
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  const isAdminOrModerator = profile && ["admin", "moderator"].includes(profile.role)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Wiki Clone</h1>
              <div className="flex items-center gap-2">
                <Button asChild size="sm">
                  <Link href="/wiki/new">
                    <Plus className="h-4 w-4 mr-2" />
                    New Page
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/search">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Link>
                </Button>
                {/* Added admin dashboard link for admins/moderators */}
                {isAdminOrModerator && (
                  <Button asChild size="sm" variant="outline">
                    <Link href="/admin">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>
              <form action={signOut}>
                <Button type="submit" size="sm" variant="outline">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>

        <PageList pages={pages} title="Recent Pages" />
      </main>
    </div>
  )
}
