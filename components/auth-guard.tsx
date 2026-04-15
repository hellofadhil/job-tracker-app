'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [loading, pathname, router, user])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Checking session...</div>
      </div>
    )
  }

  return <>{children}</>
}
