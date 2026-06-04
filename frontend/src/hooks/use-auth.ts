"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux"
import { setUser, logout as logoutAction, type RootState } from "@/store"
import { login as loginApi, register as registerApi, logout as logoutApi, getProfile } from "@/services/auth"
import type { LoginInput, RegisterInput } from "@/services/auth"

export function useAuth() {
  const dispatch = useDispatch()
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)
  return { user, isAuthenticated, isLoading }
}

export function useLogin() {
  const dispatch = useDispatch()
  const router = useRouter()

  return useMutation({
    mutationFn: (input: LoginInput) => loginApi(input),
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken)
      localStorage.setItem("refreshToken", data.refreshToken)
      dispatch(setUser(data.user))
      router.push("/dashboard/current-weather")
    },
  })
}

export function useRegister() {
  const dispatch = useDispatch()
  const router = useRouter()

  return useMutation({
    mutationFn: (input: RegisterInput) => registerApi(input),
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken)
      localStorage.setItem("refreshToken", data.refreshToken)
      dispatch(setUser(data.user))
      router.push("/dashboard/current-weather")
    },
  })
}

export function useLogout() {
  const dispatch = useDispatch()
  const router = useRouter()

  return useMutation({
    mutationFn: () => {
      const token = localStorage.getItem("refreshToken")
      return logoutApi(token || undefined)
    },
    onSettled: () => {
      dispatch(logoutAction())
      router.push("/login")
    },
  })
}

export function useProfile() {
  const dispatch = useDispatch()

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const user = await getProfile()
      dispatch(setUser(user))
      return user
    },
    retry: false,
  })
}
