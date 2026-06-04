"use client"

import { useState } from "react"
import { useAlerts, useCreateAlert, useDeleteAlert } from "@/hooks/use-alerts"
import { Card, CardContent, Button, Input, Label, Skeleton, Badge } from "@/components/ui"
import { Bell, Plus, Trash2, Loader2, AlertTriangle, Search, MapPin } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { searchLocation } from "@/services/weather"
import { cn } from "@/lib/utils"
import { PageTransition, FadeIn, StaggerGrid, StaggerItem } from "@/components/ui/animated"
import type { AlertType, AlertCondition } from "@/services/alerts"
import type { GeocodingResult } from "@/services/weather"

const alertTypeLabels: Record<AlertType, string> = {
  TEMPERATURE: "Temperature", PRECIPITATION: "Precipitation", WIND: "Wind",
  UV_INDEX: "UV Index", AIR_QUALITY: "Air Quality", STORM: "Storm", CUSTOM: "Custom",
}

const conditionLabels: Record<AlertCondition, string> = {
  ABOVE: "Above", BELOW: "Below", EQUAL: "Equal to", CHANGES_BY: "Changes by",
}

function AddAlert({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<GeocodingResult | null>(null)
  const [alertType, setAlertType] = useState<AlertType>("TEMPERATURE")
  const [condition, setCondition] = useState<AlertCondition>("ABOVE")
  const [threshold, setThreshold] = useState("")
  const create = useCreateAlert()

  const { data: results } = useQuery({
    queryKey: ["geocode", query],
    queryFn: () => searchLocation(query),
    enabled: query.length >= 2,
  })

  const handleCreate = () => {
    if (!selected || !threshold) return
    create.mutate(
      {
        locationLat: selected.latitude,
        locationLon: selected.longitude,
        locationName: selected.name,
        alertType,
        condition,
        thresholdValue: parseFloat(threshold),
      },
      { onSuccess: () => onClose() }
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search city..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
      </div>
      {results && results.length > 0 && (
        <div className="space-y-1">
          {results.map((r) => (
            <button key={r.id} onClick={() => setSelected(r)} className={cn("flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent", selected?.id === r.id && "bg-accent")}>
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{r.name}, {r.country}</span>
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <select value={alertType} onChange={(e) => setAlertType(e.target.value as AlertType)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            {Object.entries(alertTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Condition</Label>
          <select value={condition} onChange={(e) => setCondition(e.target.value as AlertCondition)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            {Object.entries(conditionLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Threshold value</Label>
        <Input type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} placeholder="e.g. 30" />
      </div>
      <Button onClick={handleCreate} className="w-full" disabled={create.isPending || !selected || !threshold}>
        {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Alert
      </Button>
    </div>
  )
}

export default function AlertsPage() {
  const { data: alerts, isLoading, error } = useAlerts()
  const deleteAlert = useDeleteAlert()
  const [adding, setAdding] = useState(false)

  return (
    <PageTransition className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
          <p className="text-muted-foreground">Weather alert rules for your locations</p>
        </div>
        <Button onClick={() => setAdding(!adding)}>
          <Plus className="mr-2 h-4 w-4" /> New Alert
        </Button>
      </div>

      {adding && (
        <FadeIn>
          <Card>
            <CardContent className="pt-6">
              <AddAlert onClose={() => setAdding(false)} />
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {isLoading && <Skeleton className="h-48 w-full rounded-lg" />}

      {error && (
        <FadeIn>
          <Card>
            <CardContent className="py-8 text-center text-destructive">Failed to load alerts.</CardContent>
          </Card>
        </FadeIn>
      )}

      {alerts && alerts.length === 0 && !adding && (
        <FadeIn>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bell className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">No alerts set</p>
              <p className="text-sm text-muted-foreground">Create alerts to get notified about weather conditions</p>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {alerts && alerts.length > 0 && (
        <StaggerGrid className="space-y-3">
          {alerts.map((alert) => (
            <StaggerItem key={alert.id}>
              <Card className="transition-all hover:shadow-md">
                <CardContent className="flex items-center justify-between pt-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <p className="font-medium">{alert.locationName || "Unknown location"}</p>
                      <Badge variant="outline">{alertTypeLabels[alert.alertType]}</Badge>
                      <Badge variant={alert.isActive ? "default" : "secondary"}>
                        {alert.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {conditionLabels[alert.condition]} {alert.thresholdValue}
                      {alert.alertType === "TEMPERATURE" ? "°" : ""}
                      {" — "}Cooldown: {alert.cooldownMinutes}min
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteAlert.mutate(alert.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}
    </PageTransition>
  )
}
