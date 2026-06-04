"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useProfile, useUpdateProfile } from "@/hooks/use-profile"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Label, Skeleton } from "@/components/ui"
import { User, Loader2, CheckCircle2 } from "lucide-react"
import { PageTransition, FadeIn } from "@/components/ui/animated"

const profileSchema = z.object({
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  unitSystem: z.enum(["METRIC", "IMPERIAL"]),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile()
  const update = useUpdateProfile()

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (profile) {
      reset({ firstName: profile.firstName || "", lastName: profile.lastName || "", unitSystem: profile.unitSystem as "METRIC" | "IMPERIAL" })
    }
  }, [profile, reset])

  const onSubmit = (data: ProfileForm) => {
    update.mutate(data)
  }

  if (isLoading) return <Skeleton className="h-96 w-full rounded-lg" />

  if (error) return (
    <Card>
      <CardContent className="py-8 text-center text-destructive">Failed to load profile.</CardContent>
    </Card>
  )

  return (
    <PageTransition className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <FadeIn>
        <Card>
          <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle>{profile?.firstName ? `${profile.firstName} ${profile.lastName || ""}` : profile?.email}</CardTitle>
              <CardDescription>{profile?.email} — {profile?.role}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {update.isSuccess && (
            <div className="mb-4 flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" /> Profile updated successfully
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Unit system</Label>
              <select {...register("unitSystem")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="METRIC">Metric (°C, km/h)</option>
                <option value="IMPERIAL">Imperial (°F, mph)</option>
              </select>
            </div>
            <Button type="submit" disabled={!isDirty || update.isPending}>
              {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
      </FadeIn>
    </PageTransition>
  )
}
