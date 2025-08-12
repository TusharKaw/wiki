import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { searchWikiPages, advancedSearchWikiPages } from "@/lib/wiki"
import SearchResults from "@/components/wiki/search-results"
import AdvancedSearch from "@/components/wiki/advanced-search"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface SearchPageProps {
  searchParams: {
    q?: string
    author?: string
    from?: string
    to?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const query = searchParams.q || ""
  const author = searchParams.author
  const dateFrom = searchParams.from
  const dateTo = searchParams.to

  let results = []

  if (query) {
    if (author || dateFrom || dateTo) {
      results = await advancedSearchWikiPages(query, author, dateFrom, dateTo)
    } else {
      results = await searchWikiPages(query)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Wiki
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Search</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <AdvancedSearch />

        {query && <SearchResults results={results} query={query} />}
      </main>
    </div>
  )
}
