import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { checkAdminPermissions, getModerationQueue } from "@/lib/admin"
import ModerationQueue from "@/components/admin/moderation-queue"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function ModerationPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const hasPermissions = await checkAdminPermissions()
  if (!hasPermissions) {
    redirect("/")
  }

  const moderationItems = await getModerationQueue()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Moderation Queue</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <ModerationQueue items={moderationItems} />
      </main>
    </div>
  )
}
