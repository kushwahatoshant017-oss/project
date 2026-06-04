import api from "@/lib/api"

export interface AdminUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: string
  isActive: boolean
  isEmailVerified: boolean
  lastLoginAt?: string
  createdAt: string
  _count: {
    sessions: number
    favoriteLocations: number
    alerts: number
    notifications: number
  }
}

export interface AdminStats {
  users: number
  weather: number
  forecast: number
  alerts: number
  favorites: number
}

export interface PaginatedUsers {
  data: AdminUser[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export async function getAdminUsers(params: { page?: number; limit?: number; search?: string; role?: string }) {
  const { data } = await api.get("/admin/users", { params })
  return data as PaginatedUsers
}

export async function getAdminStats() {
  const { data } = await api.get("/admin/stats")
  return data.data as AdminStats
}
