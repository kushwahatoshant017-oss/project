import api from "@/lib/api"

export type AlertType = "TEMPERATURE" | "PRECIPITATION" | "WIND" | "UV_INDEX" | "AIR_QUALITY" | "STORM" | "CUSTOM"
export type AlertCondition = "ABOVE" | "BELOW" | "EQUAL" | "CHANGES_BY"

export interface Alert {
  id: string
  locationLat: number
  locationLon: number
  locationName?: string
  alertType: AlertType
  condition: AlertCondition
  thresholdValue: number
  unitSystem: string
  isActive: boolean
  lastTriggeredAt?: string
  cooldownMinutes: number
  createdAt: string
}

export interface CreateAlertInput {
  locationLat: number
  locationLon: number
  locationName?: string
  alertType: AlertType
  condition: AlertCondition
  thresholdValue: number
  unitSystem?: string
  cooldownMinutes?: number
}

export async function getAlerts() {
  const { data } = await api.get("/alerts")
  return data.data as Alert[]
}

export async function createAlert(input: CreateAlertInput) {
  const { data } = await api.post("/alerts", input)
  return data.data as Alert
}

export async function deleteAlert(id: string) {
  await api.delete(`/alerts/${id}`)
}
