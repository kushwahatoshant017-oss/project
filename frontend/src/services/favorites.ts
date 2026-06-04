import api from "@/lib/api"

export interface Favorite {
  id: string
  latitude: number
  longitude: number
  locationName?: string
  label?: string
  createdAt: string
}

export interface CreateFavoriteInput {
  latitude: number
  longitude: number
  locationName?: string
  label?: string
}

export async function getFavorites() {
  const { data } = await api.get("/favorites")
  return data.data as Favorite[]
}

export async function createFavorite(input: CreateFavoriteInput) {
  const { data } = await api.post("/favorites", input)
  return data.data as Favorite
}

export async function deleteFavorite(id: string) {
  await api.delete(`/favorites/${id}`)
}
