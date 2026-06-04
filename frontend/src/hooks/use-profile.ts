"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProfile, updateProfile } from "@/services/user"
import type { UpdateProfileInput } from "@/services/user"

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  })
}
