"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getFavorites, createFavorite, deleteFavorite } from "@/services/favorites"
import type { CreateFavoriteInput } from "@/services/favorites"

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  })
}

export function useCreateFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateFavoriteInput) => createFavorite(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  })
}

export function useDeleteFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteFavorite(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  })
}
