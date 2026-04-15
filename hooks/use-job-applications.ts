'use client'

import * as React from 'react'
import { useAuth } from '@/components/auth-provider'
import { subscribeToJobApplications } from '@/lib/job-applications-db'
import type { JobApplication } from '@/lib/job-applications'

export function useJobApplications() {
  const { user, loading: authLoading } = useAuth()
  const [applications, setApplications] = React.useState<JobApplication[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (authLoading) {
      return
    }

    if (!user) {
      setApplications([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    const unsubscribe = subscribeToJobApplications(
      user.uid,
      (nextApplications) => {
        setApplications(nextApplications)
        setLoading(false)
      },
      (nextError) => {
        setError(nextError.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [authLoading, user])

  return {
    applications,
    loading: authLoading || loading,
    error,
    user,
  }
}
