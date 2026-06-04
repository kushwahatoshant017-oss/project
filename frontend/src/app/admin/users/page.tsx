"use client"

import { useState } from "react"
import { useAdminUsers } from "@/hooks/use-admin"
import { Card, CardContent, Input, Skeleton, Badge, Button } from "@/components/ui"
import { Search, ChevronLeft, ChevronRight, Shield } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { PageTransition, FadeIn } from "@/components/ui/animated"

export default function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const { data, isLoading, error } = useAdminUsers({ page, limit: 10, search: search || undefined })

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage registered users</p>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading && <Skeleton className="h-64 w-full rounded-lg" />}

      {error && (
        <FadeIn>
          <Card>
            <CardContent className="py-8 text-center text-destructive">Failed to load users.</CardContent>
          </Card>
        </FadeIn>
      )}

      {data && (
        <>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                      <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Joined</th>
                      <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">Last Login</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((user) => (
                      <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <Shield className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.email}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={user.role === "SUPER_ADMIN" ? "default" : user.role === "ADMIN" ? "secondary" : "outline"}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={user.isActive ? "default" : "destructive"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {!user.isEmailVerified && <Badge variant="outline" className="ml-1">Unverified</Badge>}
                        </td>
                        <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                          {formatDate(user.createdAt, { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                          {user.lastLoginAt ? formatDate(user.lastLoginAt, { month: "short", day: "numeric", year: "numeric" }) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                          {user._count.sessions}s / {user._count.favoriteLocations}f / {user._count.alerts}a
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} users)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={!data.meta.hasPrev}>
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={!data.meta.hasNext}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </PageTransition>
  )
}
