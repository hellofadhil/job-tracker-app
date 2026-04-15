import {
  get,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
  type Unsubscribe,
} from 'firebase/database'
import { database } from '@/lib/firebase'
import type { JobApplication, JobApplicationFormValues } from '@/lib/job-applications'

type StoredJobApplication = JobApplicationFormValues & {
  id?: string
  createdAt?: number
  updatedAt?: number
}

function applicationsCollectionRef(userId: string) {
  return ref(database, `applications/${userId}`)
}

function applicationItemRef(userId: string, applicationId: string) {
  return ref(database, `applications/${userId}/${applicationId}`)
}

function normalizeApplication(
  applicationId: string,
  value: StoredJobApplication,
): JobApplication {
  return {
    id: value.id ?? applicationId,
    companyName: value.companyName,
    jobTitle: value.jobTitle,
    jobType: value.jobType,
    workModel: value.workModel,
    location: value.location,
    salaryRange: value.salaryRange,
    source: value.source,
    applicationDate: value.applicationDate,
    followUpDate: value.followUpDate ?? '',
    status: value.status,
    notes: value.notes,
    jobLink: value.jobLink,
    recruiterContact: value.recruiterContact,
  }
}

export function subscribeToJobApplications(
  userId: string,
  onChange: (applications: JobApplication[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onValue(
    applicationsCollectionRef(userId),
    (snapshot) => {
      const value = snapshot.val() as Record<string, StoredJobApplication> | null

      if (!value) {
        onChange([])
        return
      }

      const applications = Object.entries(value)
        .map(([applicationId, item]) =>
          normalizeApplication(applicationId, item),
        )
        .sort((a, b) => b.applicationDate.localeCompare(a.applicationDate))

      onChange(applications)
    },
    (error) => {
      onError?.(error)
    },
  )
}

export async function getJobApplication(
  userId: string,
  applicationId: string,
): Promise<JobApplication | null> {
  const snapshot = await get(applicationItemRef(userId, applicationId))

  if (!snapshot.exists()) {
    return null
  }

  return normalizeApplication(
    applicationId,
    snapshot.val() as StoredJobApplication,
  )
}

export async function createJobApplication(
  userId: string,
  values: JobApplicationFormValues,
): Promise<JobApplication> {
  const nextRef = push(applicationsCollectionRef(userId))
  const id = nextRef.key

  if (!id) {
    throw new Error('Failed to generate application id.')
  }

  const payload: StoredJobApplication = {
    ...values,
    followUpDate: values.followUpDate ?? '',
    id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  await set(nextRef, payload)

  return normalizeApplication(id, payload)
}

export async function updateJobApplication(
  userId: string,
  applicationId: string,
  values: JobApplicationFormValues,
) {
  await update(applicationItemRef(userId, applicationId), {
    ...values,
    followUpDate: values.followUpDate ?? '',
    id: applicationId,
    updatedAt: Date.now(),
  })
}

export async function updateJobApplicationStatus(
  userId: string,
  applicationId: string,
  status: JobApplication['status'],
) {
  await update(applicationItemRef(userId, applicationId), {
    status,
    updatedAt: Date.now(),
  })
}

export async function deleteJobApplication(
  userId: string,
  applicationId: string,
) {
  await remove(applicationItemRef(userId, applicationId))
}
