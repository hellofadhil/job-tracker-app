'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { useAuth } from '@/components/auth-provider'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  React.useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [loading, router, user])

  if (!loading && user) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <AuthForm mode="login" />
    </Suspense>
  )
}
