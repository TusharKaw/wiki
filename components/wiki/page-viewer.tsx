import type { WikiPage } from "@/lib/wiki"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, History, Trash2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

interface PageViewerProps {
  page: WikiPage
}

export default async function PageViewer({ page }: PageViewerProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user can edit this page
  let canEdit = false
  let canDelete = false

  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    canEdit = page.author_id === user.id || (profile && ["admin", "moderator"].includes(profile.role))
    canDelete = profile && ["admin", "moderator"].includes(profile.role)
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{page.title}</h1>
              {page.summary && <p className="text-muted-foreground">{page.summary}</p>}
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <Button asChild size="sm" variant="outline">
                  <Link href={`/wiki/${page.slug}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
              )}
              <Button asChild size="sm" variant="outline">
                <Link href={`/wiki/${page.slug}/history`}>
                  <History className="h-4 w-4 mr-2" />
                  History
                </Link>
              </Button>
              {canDelete && (
                <Button size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>By {page.profiles?.full_name || page.profiles?.email || "Unknown"}</div>
            <div>Version {page.version}</div>
            <div>Updated {new Date(page.updated_at).toLocaleDateString()}</div>
            <Badge variant="secondary">{page.status}</Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose prose-slate max-w-none">
            <pre className="whitespace-pre-wrap font-sans">{page.content}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
