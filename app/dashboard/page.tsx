'use client'

import Link from 'next/link'
import type * as React from 'react'
import {
  IconAlertCircle,
  IconArrowRight,
  IconCalendarEvent,
  IconChartBar,
  IconCircleCheckFilled,
  IconClockExclamation,
} from '@tabler/icons-react'
import { useJobApplications } from '@/hooks/use-job-applications'
import type { JobApplication, JobApplicationStatus } from '@/lib/job-applications'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function getTodayKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getStatusBadge(status: JobApplicationStatus) {
  switch (status) {
    case 'Offer':
      return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
    case 'Interview':
    case 'Assessment':
      return 'border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300'
    case 'Screening':
      return 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300'
    case 'Rejected':
      return 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300'
    default:
      return 'border-border bg-muted text-muted-foreground'
  }
}

function getFollowUpPriority(
  application: JobApplication,
  today: string,
) {
  if (!application.followUpDate) {
    return null
  }

  if (application.followUpDate < today) {
    return {
      tier: 0,
      label: 'Overdue',
    }
  }

  if (application.followUpDate === today) {
    return {
      tier: 1,
      label: 'Today',
    }
  }

  return null
}

function sortReminderApplications(
  applications: JobApplication[],
  today: string,
) {
  return [...applications].sort((left, right) => {
    const leftFollowUp = left.followUpDate ?? ''
    const rightFollowUp = right.followUpDate ?? ''
    const leftPriority = getFollowUpPriority(left, today)
    const rightPriority = getFollowUpPriority(right, today)

    if (!leftPriority || !rightPriority) {
      return 0
    }

    if (leftPriority.tier !== rightPriority.tier) {
      return leftPriority.tier - rightPriority.tier
    }

    if (leftPriority.tier === 0) {
      return leftFollowUp.localeCompare(rightFollowUp)
    }

    return left.applicationDate.localeCompare(right.applicationDate)
  })
}

export default function Page() {
  const { applications, loading } = useJobApplications()
  const today = getTodayKey()

  const statusCounts = applications.reduce<Record<JobApplicationStatus, number>>(
    (acc, item) => {
      acc[item.status] += 1
      return acc
    },
    {
      Applied: 0,
      Screening: 0,
      Interview: 0,
      Assessment: 0,
      Offer: 0,
      Rejected: 0,
    },
  )

  const reminders = sortReminderApplications(
    applications.filter((item) => {
      if (!item.followUpDate) {
        return false
      }

      return item.followUpDate <= today
    }),
    today,
  )

  const nextAction = reminders[0] ?? null

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Job tracker dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Keep your applications moving with live reminders, follow-up dates,
              and one clear next action.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/applications">Open applications page</Link>
          </Button>
        </div>

        {nextAction ? (
          <div className="rounded-3xl border bg-card p-6 shadow-sm dark:border-white/[0.035] dark:bg-[linear-gradient(135deg,rgba(37,99,235,0.09),rgba(17,17,19,0.96)_68%)] dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.18)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium tracking-wide text-blue-300 uppercase">
                  <IconClockExclamation className="size-3.5" />
                  Next Action
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Follow up with {nextAction.companyName}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {nextAction.jobTitle} · {nextAction.followUpDate === today ? 'Due today' : 'Overdue'} · {formatDate(nextAction.followUpDate ?? today)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={getStatusBadge(nextAction.status)}
                >
                  {nextAction.status}
                </Badge>
              </div>
              <Button asChild className="dark:bg-blue-600 dark:hover:bg-blue-500">
                <Link href={`/dashboard/applications/${nextAction.id}/edit`}>
                  Open follow-up
                  <IconArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border bg-card p-6 shadow-sm dark:border-white/[0.04] dark:bg-[#181818] dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.16)]">
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/18 text-emerald-400">
                <IconCircleCheckFilled className="size-7" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">No follow-ups due right now</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  You do not have any overdue or today follow-up items. Add a
                  follow-up date to an application to see it here.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <OverviewCard
            label="Applications"
            value={loading ? '...' : String(applications.length)}
            tone="blue"
            icon={<IconChartBar className="size-7" />}
          />
          <OverviewCard
            label="In Interview Flow"
            value={loading ? '...' : String(statusCounts.Interview + statusCounts.Assessment)}
            tone="green"
            icon={<IconCircleCheckFilled className="size-7" />}
          />
          <OverviewCard
            label="Offers"
            value={loading ? '...' : String(statusCounts.Offer)}
            tone="amber"
            icon={<IconCalendarEvent className="size-7" />}
          />
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm dark:border-white/[0.04] dark:bg-[#181818] dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.16)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Dashboard reminders</h2>
              <p className="text-sm text-muted-foreground">
                Applications with overdue follow-ups or actions due today.
              </p>
            </div>
            <Badge variant="secondary">{reminders.length}</Badge>
          </div>

          {reminders.length ? (
            <div className="mt-5 grid gap-3">
              {reminders.map((item) => {
                const priority = getFollowUpPriority(item, today)

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-2xl border bg-background/70 p-4 dark:border-white/[0.05] dark:bg-[#141414]"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-medium">
                          {item.companyName} - {item.jobTitle}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Follow-up: {formatDate(item.followUpDate ?? today)}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={getStatusBadge(item.status)}>
                          {item.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            priority?.tier === 0
                              ? 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                              : 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                          }
                        >
                          {priority?.label}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/dashboard/applications/${item.id}/edit`}>
                          Open
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border bg-background/70 p-4 text-sm text-muted-foreground dark:border-white/[0.05] dark:bg-[#141414]">
              <IconAlertCircle className="mt-0.5 size-4 shrink-0" />
              No follow-ups due right now.
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function OverviewCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: string
  icon: React.ReactNode
  tone: 'blue' | 'green' | 'amber'
}) {
  const toneClassMap = {
    blue:
      'dark:border-white/[0.035] dark:bg-[linear-gradient(135deg,rgba(37,99,235,0.09),rgba(17,17,19,0.96)_68%)] dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.18)]',
    green:
      'dark:border-white/[0.035] dark:bg-[linear-gradient(135deg,rgba(22,163,74,0.09),rgba(17,17,19,0.96)_68%)] dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.18)]',
    amber:
      'dark:border-white/[0.035] dark:bg-[linear-gradient(135deg,rgba(217,119,6,0.09),rgba(17,17,19,0.96)_68%)] dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.18)]',
  } as const

  const iconToneClassMap = {
    blue: 'bg-blue-500/18 text-blue-400',
    green: 'bg-emerald-500/18 text-emerald-400',
    amber: 'bg-orange-500/18 text-orange-400',
  } as const

  return (
    <div
      className={`rounded-3xl border bg-card p-5 shadow-sm dark:shadow-black/30 ${toneClassMap[tone]}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${iconToneClassMap[tone]}`}
        >
          {icon}
        </div>
        <div className="pt-0.5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-semibold leading-none">{value}</p>
        </div>
      </div>
    </div>
  )
}
