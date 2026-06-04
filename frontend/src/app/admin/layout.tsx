"use client"

import { AuthGuard } from "@/components/auth/auth-guard"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole={["ADMIN", "SUPER_ADMIN"]}>
      <div className="min-h-screen bg-dot-pattern p-6">
        {children}
      </div>
    </AuthGuard>
  )
}
