"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setUser, setLoading } from "@/store"
import { getProfile } from "@/services/auth"

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      dispatch(setLoading(false))
      return
    }

    getProfile()
      .then((user) => {
        dispatch(setUser(user))
      })
      .catch(() => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        dispatch(setUser(null))
      })
  }, [dispatch])

  return <>{children}</>
}
