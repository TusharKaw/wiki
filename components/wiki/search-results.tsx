import type React from "react"
import type { WikiPage } from "@/lib/wiki"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface SearchResultsProps {
  results: WikiPage[]
  query: string
}

export default function SearchResults({ results, query }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {query ? (
            <>
              No pages found for "{query}".{" "}
              <Link href="/wiki/new" className="text-primary hover:underline">
                Create a new page?
              </Link>
            </>
          ) : (
            "Enter a search term to find pages."
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
        </h2>
      </div>

      <div className="grid gap-4">
        {results.map((page) => (
          <Card key={page.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">
                  <Link href={`/wiki/${page.slug}`} className="hover:text-primary transition-colors">
                    {highlightText(page.title, query)}
                  </Link>
                </CardTitle>
                <Badge variant="secondary">{page.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {page.summary && <p className="text-muted-foreground mb-2">{highlightText(page.summary, query)}</p>}

              {/* Show content preview with highlighted search terms */}
              <div className="text-sm text-muted-foreground mb-3">{getContentPreview(page.content, query)}</div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div>By {page.profiles?.full_name || page.profiles?.email || "Unknown"}</div>
                <div>Version {page.version}</div>
                <div>Updated {new Date(page.updated_at).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

function getContentPreview(content: string, query: string): React.ReactNode {
  const maxLength = 200
  const queryIndex = content.toLowerCase().indexOf(query.toLowerCase())

  let preview = ""
  if (queryIndex !== -1) {
    // Show context around the search term
    const start = Math.max(0, queryIndex - 50)
    const end = Math.min(content.length, queryIndex + query.length + 150)
    preview = (start > 0 ? "..." : "") + content.slice(start, end) + (end < content.length ? "..." : "")
  } else {
    // Show beginning of content
    preview = content.slice(0, maxLength) + (content.length > maxLength ? "..." : "")
  }

  return highlightText(preview, query)
}
