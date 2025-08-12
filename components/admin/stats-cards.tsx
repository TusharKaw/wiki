import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, AlertCircle, CheckCircle } from "lucide-react"

interface StatsCardsProps {
  stats: {
    pages: {
      total: number
      published: number
      draft: number
      pending: number
      archived: number
    }
    users: {
      total: number
      admins: number
      moderators: number
      users: number
    }
    moderation: {
      total: number
      pending: number
      approved: number
      rejected: number
    }
  }
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pages.total}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{stats.pages.published} published</Badge>
            <Badge variant="outline">{stats.pages.draft} drafts</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.users.total}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{stats.users.admins} admins</Badge>
            <Badge variant="outline">{stats.users.moderators} mods</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.moderation.pending}</div>
          <p className="text-xs text-muted-foreground">Items awaiting moderation</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Moderation Actions</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.moderation.approved + stats.moderation.rejected}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{stats.moderation.approved} approved</Badge>
            <Badge variant="destructive">{stats.moderation.rejected} rejected</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
