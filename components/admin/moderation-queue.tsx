"use client"

import { useState } from "react"
import type { ModerationItem } from "@/lib/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, Eye } from "lucide-react"
import { approveModerationItem, rejectModerationItem } from "@/lib/admin-actions"
import Link from "next/link"

interface ModerationQueueProps {
  items: ModerationItem[]
}

export default function ModerationQueue({ items }: ModerationQueueProps) {
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set())
  const [notes, setNotes] = useState<Record<string, string>>({})

  const handleApprove = async (itemId: string) => {
    setProcessingItems((prev) => new Set(prev).add(itemId))
    const result = await approveModerationItem(itemId, notes[itemId])
    if (result.error) {
      console.error("Failed to approve:", result.error)
    }
    setProcessingItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(itemId)
      return newSet
    })
  }

  const handleReject = async (itemId: string) => {
    setProcessingItems((prev) => new Set(prev).add(itemId))
    const result = await rejectModerationItem(itemId, notes[itemId])
    if (result.error) {
      console.error("Failed to reject:", result.error)
    }
    setProcessingItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(itemId)
      return newSet
    })
  }

  const updateNotes = (itemId: string, value: string) => {
    setNotes((prev) => ({ ...prev, [itemId]: value }))
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">No items in moderation queue.</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Moderation Queue</h2>
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">
                  {item.action_type === "create" && "New Page Creation"}
                  {item.action_type === "edit" && "Page Edit"}
                  {item.action_type === "delete" && "Page Deletion"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      item.status === "pending" ? "default" : item.status === "approved" ? "secondary" : "destructive"
                    }
                  >
                    {item.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    by {item.profiles?.full_name || item.profiles?.email || "Unknown"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {item.wiki_pages && (
                <Button asChild size="sm" variant="outline">
                  <Link href={`/wiki/${item.wiki_pages.slug}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Page
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {item.proposed_title && (
              <div>
                <h4 className="font-medium mb-1">Proposed Title:</h4>
                <p className="text-sm">{item.proposed_title}</p>
              </div>
            )}

            {item.proposed_summary && (
              <div>
                <h4 className="font-medium mb-1">Summary:</h4>
                <p className="text-sm text-muted-foreground">{item.proposed_summary}</p>
              </div>
            )}

            {item.proposed_content && (
              <div>
                <h4 className="font-medium mb-1">Content Preview:</h4>
                <div className="bg-muted p-3 rounded text-sm max-h-32 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{item.proposed_content.slice(0, 500)}...</pre>
                </div>
              </div>
            )}

            {item.status === "pending" && (
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <label htmlFor={`notes-${item.id}`} className="text-sm font-medium">
                    Moderator Notes (optional)
                  </label>
                  <Textarea
                    id={`notes-${item.id}`}
                    placeholder="Add notes about your decision..."
                    value={notes[item.id] || ""}
                    onChange={(e) => updateNotes(item.id, e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(item.id)}
                    disabled={processingItems.has(item.id)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(item.id)}
                    disabled={processingItems.has(item.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            )}

            {item.status !== "pending" && item.moderator_notes && (
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-1">Moderator Notes:</h4>
                <p className="text-sm text-muted-foreground">{item.moderator_notes}</p>
                {item.reviewed_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Reviewed on {new Date(item.reviewed_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
