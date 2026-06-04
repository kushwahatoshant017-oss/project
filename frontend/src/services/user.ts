import api from "@/lib/api"

export interface UserProfile {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: string
  isEmailVerified: boolean
  unitSystem: string
  avatarUrl?: string
  lastLoginAt?: string
  createdAt: string
}

export interface UpdateProfileInput {
  firstName?: string
  lastName?: string
  avatarUrl?: string
  unitSystem?: "METRIC" | "IMPERIAL"
}

export async function getProfile() {
  const { data } = await api.get("/users/profile")
  return data.data as UserProfile
}

export async function updateProfile(input: UpdateProfileInput) {
  const { data } = await api.put("/users/profile", input)
  return data.data as UserProfile
}
