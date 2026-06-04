"use client"

import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"
import { StoreProvider } from "./store-provider"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <QueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </QueryProvider>
    </StoreProvider>
  )
}
