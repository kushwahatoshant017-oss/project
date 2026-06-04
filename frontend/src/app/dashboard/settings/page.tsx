"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from "@/components/ui"
import { Monitor, Sun, Moon, Languages } from "lucide-react"
import { cn } from "@/lib/utils"
import { PageTransition, FadeIn } from "@/components/ui/animated"

const themes = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
]

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <PageTransition className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      <FadeIn>
        <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose your preferred color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {themes.map((t) => {
              const Icon = t.icon
              const active = theme === t.value
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                    active ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/30"
                  )}
                >
                  <Icon className={cn("h-6 w-6", active ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-sm font-medium", active && "text-primary")}>{t.label}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <CardDescription>Select your preferred language</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <Button key={lang.code} variant="outline" size="sm" className="gap-2">
                <Languages className="h-4 w-4" />
                {lang.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      </FadeIn>
    </PageTransition>
  )
}
