"use client"

import { useAdminStats } from "@/hooks/use-admin"
import { Card, CardContent, Skeleton } from "@/components/ui"
import { Users, CloudSun, Bell, Heart, CalendarDays } from "lucide-react"
import { PageTransition, FadeIn, StaggerGrid, StaggerItem } from "@/components/ui/animated"

const statCards = [
  { label: "Users", icon: Users, key: "users" as const, color: "text-blue-600 bg-blue-100 dark:bg-blue-950" },
  { label: "Weather Records", icon: CloudSun, key: "weather" as const, color: "text-green-600 bg-green-100 dark:bg-green-950" },
  { label: "Forecasts", icon: CalendarDays, key: "forecast" as const, color: "text-purple-600 bg-purple-100 dark:bg-purple-950" },
  { label: "Alerts", icon: Bell, key: "alerts" as const, color: "text-amber-600 bg-amber-100 dark:bg-amber-950" },
  { label: "Favorites", icon: Heart, key: "favorites" as const, color: "text-rose-600 bg-rose-100 dark:bg-rose-950" },
]

export default function AdminPage() {
  const { data: stats, isLoading, error } = useAdminStats()

  return (
    <PageTransition className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and statistics</p>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
      )}

      {error && (
        <FadeIn>
          <Card>
            <CardContent className="py-8 text-center text-destructive">Failed to load admin stats.</CardContent>
          </Card>
        </FadeIn>
      )}

      {stats && (
        <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map(({ label, icon: Icon, key, color }) => (
            <StaggerItem key={key}>
              <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats[key]}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}
    </PageTransition>
  )
}
