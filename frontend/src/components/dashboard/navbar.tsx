"use client"

import { useTheme } from "next-themes"
import { useAuth, useLogout } from "@/hooks/use-auth"
import { Button } from "@/components/ui"
import { Moon, Sun, LogOut, User, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const logout = useLogout()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}
        <Link href="/dashboard/profile">
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user?.firstName || user?.email}</span>
          </Button>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => logout.mutate()}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
