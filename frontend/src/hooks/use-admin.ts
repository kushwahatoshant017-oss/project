"use client"

import { useQuery } from "@tanstack/react-query"
import { getAdminStats, getAdminUsers } from "@/services/admin"

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  })
}

export function useAdminUsers(params: { page?: number; limit?: number; search?: string; role?: string }) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => getAdminUsers(params),
  })
}
