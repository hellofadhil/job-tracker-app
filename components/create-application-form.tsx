'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth-provider'
import {
  ApplicationForm,
  type ApplicationFormValues,
} from '@/components/application-form'
import { createJobApplication } from '@/lib/job-applications-db'

export function CreateApplicationForm() {
  const router = useRouter()
  const { user } = useAuth()

  async function handleSubmit(values: ApplicationFormValues) {
    try {
      if (!user) {
        throw new Error('You need to be signed in to create an application.')
      }

      await createJobApplication(user.uid, values)
      toast.success('Application created successfully.')
      router.push('/dashboard/applications')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create application.'
      toast.error(message)
    }
  }

  return (
    <ApplicationForm
      badgeLabel="New Tracker Entry"
      title="Create application"
      description="Add a new job application with source, salary, recruiter details, and notes so every opportunity stays organized from first apply to final outcome."
      submitLabel="Save Application"
      submittingLabel="Saving..."
      onSubmit={handleSubmit}
    />
  )
}
