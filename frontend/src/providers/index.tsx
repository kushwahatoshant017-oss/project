"use client"

import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"
import { StoreProvider } from "./store-provider"
import { AuthInitializer } from "@/components/auth/auth-initializer"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <QueryProvider>
        <AuthInitializer>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </AuthInitializer>
      </QueryProvider>
    </StoreProvider>
  )
}
