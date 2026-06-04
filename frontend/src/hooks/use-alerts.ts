"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAlerts, createAlert, deleteAlert } from "@/services/alerts"
import type { CreateAlertInput } from "@/services/alerts"

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: getAlerts,
  })
}

export function useCreateAlert() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAlertInput) => createAlert(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  })
}

export function useDeleteAlert() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAlert(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  })
}
