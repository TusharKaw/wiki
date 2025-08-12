"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"
import { createWikiPage, updateWikiPage } from "@/lib/wiki-actions"
import type { WikiPage } from "@/lib/wiki"

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? "Updating..." : "Creating..."}
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? "Update Page" : "Create Page"}
        </>
      )}
    </Button>
  )
}

interface PageEditorProps {
  page?: WikiPage
  isEditing?: boolean
}

export default function PageEditor({ page, isEditing = false }: PageEditorProps) {
  const action = isEditing && page ? updateWikiPage.bind(null, page.id) : createWikiPage

  const [state, formAction] = useActionState(action, null)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Page" : "Create New Page"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded text-sm">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Enter page title"
              defaultValue={page?.title || ""}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="summary" className="text-sm font-medium">
              Summary (optional)
            </label>
            <Input
              id="summary"
              name="summary"
              type="text"
              placeholder="Brief description of changes or page content"
              defaultValue={page?.summary || ""}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your content here using Markdown..."
              defaultValue={page?.content || ""}
              className="min-h-[400px] font-mono"
              required
            />
            <p className="text-xs text-muted-foreground">
              You can use Markdown formatting for headers, links, lists, and more.
            </p>
          </div>

          <div className="flex gap-2">
            <SubmitButton isEditing={isEditing} />
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
