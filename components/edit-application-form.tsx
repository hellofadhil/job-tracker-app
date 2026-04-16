'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth-provider'
import { useI18n } from '@/components/locale-provider'
import {
  ApplicationForm,
  type ApplicationFormValues,
} from '@/components/application-form'
import {
  getJobApplication,
  updateJobApplication,
} from '@/lib/job-applications-db'

export function EditApplicationForm({
  applicationId,
}: {
  applicationId: string
}) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { t } = useI18n()
  const [initialValues, setInitialValues] =
    React.useState<ApplicationFormValues | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (authLoading) {
      return
    }

    if (!user) {
      setLoading(false)
      return
    }

    let isMounted = true

    void getJobApplication(user.uid, applicationId)
      .then((application) => {
        if (!isMounted) {
          return
        }

        if (!application) {
          toast.error(t('applications.notFoundError'))
          router.push('/dashboard/applications')
          return
        }

        const { id: _id, ...values } = application
        setInitialValues(values)
        setLoading(false)
      })
      .catch((error) => {
        if (!isMounted) {
          return
        }

        toast.error(
          error instanceof Error
            ? error.message
            : t('applications.loadFailed'),
        )
        router.push('/dashboard/applications')
      })

    return () => {
      isMounted = false
    }
  }, [applicationId, authLoading, router, user])

  async function handleSubmit(values: ApplicationFormValues) {
    try {
      if (!user) {
        throw new Error('You need to be signed in to update an application.')
      }

      await updateJobApplication(user.uid, applicationId, values)
      toast.success(t('applications.updateSuccess'))
      router.push('/dashboard/applications')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('applications.updateFailed')
      toast.error(message)
    }
  }

  return (
    <ApplicationForm
      badgeLabel={t('form.trackerUpdate')}
      title={t('form.editTitle')}
      description={t('form.editDescription')}
      submitLabel={t('form.updateApplication')}
      submittingLabel={t('form.updating')}
      initialValues={initialValues ?? undefined}
      onSubmit={handleSubmit}
      loading={authLoading || loading}
    />
  )
}
