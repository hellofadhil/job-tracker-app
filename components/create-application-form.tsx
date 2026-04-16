'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth-provider'
import { useI18n } from '@/components/locale-provider'
import {
  ApplicationForm,
  type ApplicationFormValues,
} from '@/components/application-form'
import { createJobApplication } from '@/lib/job-applications-db'

export function CreateApplicationForm() {
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useI18n()

  async function handleSubmit(values: ApplicationFormValues) {
    try {
      if (!user) {
        throw new Error('You need to be signed in to create an application.')
      }

      await createJobApplication(user.uid, values)
      toast.success(t('applications.createSuccess'))
      router.push('/dashboard/applications')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('applications.createFailed')
      toast.error(message)
    }
  }

  return (
    <ApplicationForm
      badgeLabel={t('form.newTrackerEntry')}
      title={t('form.createTitle')}
      description={t('form.createDescription')}
      submitLabel={t('form.saveApplication')}
      submittingLabel={t('form.saving')}
      onSubmit={handleSubmit}
    />
  )
}
