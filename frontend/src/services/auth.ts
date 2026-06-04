import api from "@/lib/api"

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    firstName?: string
    lastName?: string
    role: string
    isEmailVerified: boolean
    unitSystem: string
    avatarUrl?: string
  }
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const { data } = await api.post("/auth/login", input)
  return data.data
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await api.post("/auth/register", input)
  return data.data
}

export async function logout(refreshToken?: string) {
  await api.post("/auth/logout", { refreshToken })
}

export async function getProfile() {
  const { data } = await api.get("/users/profile")
  return data.data
}
