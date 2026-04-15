'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  React.useEffect(() => {
    if (!loading) {
      router.replace(user ? '/dashboard' : '/login')
    }
  }, [loading, router, user])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-sm text-muted-foreground">Loading...</div>
    </div>
  )
}
