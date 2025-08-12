import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { checkAdminPermissions, getWikiStats, getModerationQueue } from "@/lib/admin"
import StatsCards from "@/components/admin/stats-cards"
import ModerationQueue from "@/components/admin/moderation-queue"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, ArrowLeft } from "lucide-react"

export default async function AdminDashboard() {
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

  const [stats, moderationItems] = await Promise.all([getWikiStats(), getModerationQueue()])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Wiki
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/users">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <StatsCards stats={stats} />
        <ModerationQueue items={moderationItems.filter((item) => item.status === "pending")} />
      </main>
    </div>
  )
}
