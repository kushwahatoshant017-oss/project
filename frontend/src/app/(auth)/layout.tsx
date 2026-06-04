export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 bg-dot-pattern">
      <div className="w-full max-w-md px-4">{children}</div>
    </div>
  )
}
