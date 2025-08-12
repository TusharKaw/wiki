"use client"

import { useState } from "react"
import type { UserProfile } from "@/lib/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateUserRole } from "@/lib/admin-actions"

interface UserManagementProps {
  users: UserProfile[]
  currentUserId: string
}

export default function UserManagement({ users, currentUserId }: UserManagementProps) {
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set())

  const handleRoleChange = async (userId: string, newRole: "user" | "admin" | "moderator") => {
    setUpdatingUsers((prev) => new Set(prev).add(userId))
    const result = await updateUserRole(userId, newRole)
    if (result.error) {
      console.error("Failed to update role:", result.error)
    }
    setUpdatingUsers((prev) => {
      const newSet = new Set(prev)
      newSet.delete(userId)
      return newSet
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">User Management</h2>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{user.full_name || "No name"}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  <div className="text-xs text-muted-foreground">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={user.role === "admin" ? "default" : user.role === "moderator" ? "secondary" : "outline"}
                  >
                    {user.role}
                  </Badge>

                  {user.id !== currentUserId && (
                    <Select
                      value={user.role}
                      onValueChange={(value: "user" | "admin" | "moderator") => handleRoleChange(user.id, value)}
                      disabled={updatingUsers.has(user.id)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {user.id === currentUserId && <span className="text-sm text-muted-foreground">(You)</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
