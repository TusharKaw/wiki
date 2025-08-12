import type { WikiPage } from "@/lib/wiki"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface PageListProps {
  pages: WikiPage[]
  title?: string
}

export default function PageList({ pages, title = "Wiki Pages" }: PageListProps) {
  if (pages.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No pages found.{" "}
          <Link href="/wiki/new" className="text-primary hover:underline">
            Create the first one!
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid gap-4">
        {pages.map((page) => (
          <Card key={page.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">
                  <Link href={`/wiki/${page.slug}`} className="hover:text-primary transition-colors">
                    {page.title}
                  </Link>
                </CardTitle>
                <Badge variant="secondary">{page.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {page.summary && <p className="text-muted-foreground mb-2">{page.summary}</p>}
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
