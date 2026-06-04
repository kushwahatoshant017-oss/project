"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import {
  CloudSun,
  Clock,
  CalendarDays,
  Wind,
  Bell,
  Heart,
  User,
  Settings,
  Shield,
  X,
} from "lucide-react"
import { Button } from "@/components/ui"

const navItems = [
  { href: "/dashboard/current-weather", label: "Current Weather", icon: CloudSun },
  { href: "/dashboard/hourly-forecast", label: "Hourly Forecast", icon: Clock },
  { href: "/dashboard/weekly-forecast", label: "Weekly Forecast", icon: CalendarDays },
  { href: "/dashboard/air-quality", label: "Air Quality", icon: Wind },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r bg-sidebar transition-transform duration-300 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b bg-gradient-to-r from-primary/5 to-transparent px-4">
          <Link href="/dashboard/current-weather" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CloudSun className="h-5 w-5" />
            </div>
            <span className="text-sidebar-foreground">WeatherSphere</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 md:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="border-t p-2">
          {isAdmin && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Shield className="h-5 w-5 shrink-0" />
              <span>Admin</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  )
}
