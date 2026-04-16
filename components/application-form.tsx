'use client'

import * as React from 'react'
import {
  IconCalendarEvent,
  IconDeviceFloppy,
  IconPlus,
  IconTimeline,
  IconTrash,
} from '@tabler/icons-react'
import { useI18n } from '@/components/locale-provider'
import type {
  JobApplicationFormValues,
  JobApplicationTimelineCategory,
  JobApplicationTimelineEntry,
  JobApplicationSource,
  JobApplicationStatus,
  JobApplicationType,
  WorkModel,
} from '@/lib/job-applications'
import {
  jobApplicationSources,
  jobApplicationStatuses,
  jobApplicationTimelineCategories,
  jobApplicationTypes,
  workModels,
} from '@/lib/job-applications'
import {
  translateJobType,
  translateSource,
  translateStatus,
  translateTimelineCategory,
  translateWorkModel,
} from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export type ApplicationFormValues = JobApplicationFormValues

export const defaultApplicationFormValues: ApplicationFormValues = {
  companyName: '',
  jobTitle: '',
  jobType: 'Full-time',
  workModel: 'Remote',
  location: '',
  salaryRange: '',
  source: 'LinkedIn',
  applicationDate: new Date().toISOString().slice(0, 10),
  followUpDate: '',
  status: 'Applied',
  notes: '',
  jobLink: '',
  recruiterContact: '',
  timeline: [],
}

type ApplicationFormProps = {
  badgeLabel: string
  title: string
  description: string
  submitLabel: string
  submittingLabel: string
  initialValues?: Partial<ApplicationFormValues>
  onSubmit: (values: ApplicationFormValues) => Promise<void>
  loading?: boolean
}

export function ApplicationForm({
  badgeLabel,
  title,
  description,
  submitLabel,
  submittingLabel,
  initialValues,
  onSubmit,
  loading = false,
}: ApplicationFormProps) {
  const { locale, t } = useI18n()
  const [form, setForm] = React.useState<ApplicationFormValues>({
    ...defaultApplicationFormValues,
    ...initialValues,
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    setForm({
      ...defaultApplicationFormValues,
      ...initialValues,
    })
  }, [initialValues])

  const fieldClassName =
    'border-border bg-background/80 shadow-sm transition-colors dark:border-white/[0.05] dark:bg-[#141414] dark:text-foreground dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] dark:placeholder:text-muted-foreground/70 dark:hover:border-white/[0.07] dark:focus-visible:border-white/[0.12] dark:focus-visible:ring-1 dark:focus-visible:ring-blue-500/30'
  const selectTriggerClassName = `w-full ${fieldClassName}`

  function updateField<K extends keyof ApplicationFormValues>(
    key: K,
    value: ApplicationFormValues[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function addTimelineEntry() {
    setForm((current) => ({
      ...current,
      timeline: [
        ...current.timeline,
        {
          id: crypto.randomUUID(),
          date: current.followUpDate || current.applicationDate,
          category: 'Follow-up',
          title: '',
          description: '',
        },
      ],
    }))
  }

  function updateTimelineEntry(
    entryId: string,
    key: keyof JobApplicationTimelineEntry,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      timeline: current.timeline.map((entry) =>
        entry.id === entryId ? { ...entry, [key]: value } : entry,
      ),
    }))
  }

  function removeTimelineEntry(entryId: string) {
    setForm((current) => ({
      ...current,
      timeline: current.timeline.filter((entry) => entry.id !== entryId),
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(form)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-4 pb-6 lg:px-6">
      <div className="mb-6">
        <div className="rounded-3xl border border-border bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_30%),linear-gradient(135deg,hsl(var(--card))_0%,hsl(var(--muted)/0.7)_100%)] p-6 shadow-sm dark:border-white/[0.04] dark:bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_28%),linear-gradient(135deg,rgba(30,33,46,0.94)_0%,rgba(17,17,19,0.98)_78%)] dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.18)]">
          <div className="inline-flex rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium tracking-wide text-primary dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-blue-300">
            {badgeLabel}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <Card className="overflow-hidden border-border shadow-sm dark:border-white/[0.04] dark:bg-[#181818] dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.16)]">
          <CardHeader className="bg-card dark:bg-[#181818]">
            <CardTitle>{t('form.applicationDetails')}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('form.applicationDetailsDescription')}
            </p>
          </CardHeader>
          <CardContent className="grid gap-5 pt-2">
            <div className="grid gap-5 md:grid-cols-2">
              <Field>
                <Label htmlFor="companyName">{t('form.companyName')}</Label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={(event) => updateField('companyName', event.target.value)}
                  className={fieldClassName}
                  placeholder={t('form.companyPlaceholder')}
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="jobTitle">{t('form.jobTitle')}</Label>
                <Input
                  id="jobTitle"
                  value={form.jobTitle}
                  onChange={(event) => updateField('jobTitle', event.target.value)}
                  className={fieldClassName}
                  placeholder={t('form.jobTitlePlaceholder')}
                  required
                />
              </Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <Field>
                <Label>{t('form.jobType')}</Label>
                <Select
                  value={form.jobType}
                  onValueChange={(value) =>
                    updateField('jobType', value as JobApplicationType)
                  }
                >
                  <SelectTrigger className={selectTriggerClassName}>
                    <SelectValue placeholder={t('form.selectJobType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {jobApplicationTypes.map((item) => (
                      <SelectItem key={item} value={item}>
                        {translateJobType(locale, item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <Label>{t('form.workModel')}</Label>
                <Select
                  value={form.workModel}
                  onValueChange={(value) =>
                    updateField('workModel', value as WorkModel)
                  }
                >
                  <SelectTrigger className={selectTriggerClassName}>
                    <SelectValue placeholder={t('form.selectWorkModel')} />
                  </SelectTrigger>
                  <SelectContent>
                    {workModels.map((item) => (
                      <SelectItem key={item} value={item}>
                        {translateWorkModel(locale, item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <Label>{t('form.source')}</Label>
                <Select
                  value={form.source}
                  onValueChange={(value) =>
                    updateField('source', value as JobApplicationSource)
                  }
                >
                  <SelectTrigger className={selectTriggerClassName}>
                    <SelectValue placeholder={t('form.selectSource')} />
                  </SelectTrigger>
                  <SelectContent>
                    {jobApplicationSources.map((item) => (
                      <SelectItem key={item} value={item}>
                        {translateSource(locale, item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <Label>{t('form.status')}</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    updateField('status', value as JobApplicationStatus)
                  }
                >
                  <SelectTrigger className={selectTriggerClassName}>
                    <SelectValue placeholder={t('form.selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    {jobApplicationStatuses.map((item) => (
                      <SelectItem key={item} value={item}>
                        {translateStatus(locale, item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <Field>
                <Label htmlFor="location">{t('form.location')}</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(event) => updateField('location', event.target.value)}
                  className={fieldClassName}
                  placeholder={t('form.locationPlaceholder')}
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="applicationDate">{t('form.applicationDate')}</Label>
                <Input
                  id="applicationDate"
                  type="date"
                  value={form.applicationDate}
                  onChange={(event) => updateField('applicationDate', event.target.value)}
                  className={fieldClassName}
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="followUpDate">{t('form.followUpDate')}</Label>
                <Input
                  id="followUpDate"
                  type="date"
                  value={form.followUpDate ?? ''}
                  onChange={(event) => updateField('followUpDate', event.target.value)}
                  className={fieldClassName}
                />
              </Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field>
                <Label htmlFor="salaryRange">{t('form.salary')}</Label>
                <Input
                  id="salaryRange"
                  value={form.salaryRange}
                  onChange={(event) => updateField('salaryRange', event.target.value)}
                  className={fieldClassName}
                  placeholder={t('form.salaryPlaceholder')}
                />
              </Field>
              <Field>
                <Label htmlFor="recruiterContact">{t('form.recruiter')}</Label>
                <Input
                  id="recruiterContact"
                  value={form.recruiterContact}
                  onChange={(event) =>
                    updateField('recruiterContact', event.target.value)
                  }
                  className={fieldClassName}
                  placeholder={t('form.recruiterPlaceholder')}
                />
              </Field>
            </div>

            <Field>
              <Label htmlFor="jobLink">{t('form.jobLink')}</Label>
              <Input
                id="jobLink"
                type="url"
                value={form.jobLink}
                onChange={(event) => updateField('jobLink', event.target.value)}
                className={fieldClassName}
                placeholder={t('form.jobLinkPlaceholder')}
              />
            </Field>

            <Field>
              <Label htmlFor="notes">{t('form.notes')}</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(event) => updateField('notes', event.target.value)}
                className={`min-h-40 ${fieldClassName}`}
                placeholder={t('form.notesPlaceholder')}
              />
            </Field>

            <div className="grid gap-4 rounded-2xl border border-border/80 bg-muted/20 p-4 dark:border-white/[0.05] dark:bg-[#141414]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <IconTimeline className="size-4 text-primary" />
                    <Label className="text-base font-semibold">
                      {t('form.activityTimeline')}
                    </Label>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('form.activityTimelineDescription')}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTimelineEntry}
                >
                  <IconPlus className="size-4" />
                  {t('form.addActivity')}
                </Button>
              </div>

              {form.timeline.length ? (
                <div className="grid gap-3">
                  {form.timeline.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="grid gap-3 rounded-2xl border border-border/80 bg-background/80 p-4 dark:border-white/[0.05] dark:bg-[#111214]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium">
                          {t('form.activity')} {index + 1}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeTimelineEntry(entry.id)}
                        >
                          <IconTrash className="size-4" />
                          {t('form.remove')}
                        </Button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-[180px_1fr]">
                        <Field>
                          <Label htmlFor={`timeline-date-${entry.id}`}>
                            {t('form.date')}
                          </Label>
                          <Input
                            id={`timeline-date-${entry.id}`}
                            type="date"
                            value={entry.date}
                            onChange={(event) =>
                              updateTimelineEntry(entry.id, 'date', event.target.value)
                            }
                            className={fieldClassName}
                          />
                        </Field>
                        <Field>
                          <Label htmlFor={`timeline-category-${entry.id}`}>
                            {t('form.category')}
                          </Label>
                          <Select
                            value={entry.category}
                            onValueChange={(value) =>
                              updateTimelineEntry(
                                entry.id,
                                'category',
                                value as JobApplicationTimelineCategory,
                              )
                            }
                          >
                            <SelectTrigger
                              id={`timeline-category-${entry.id}`}
                              className={selectTriggerClassName}
                            >
                              <SelectValue placeholder={t('form.selectCategory')} />
                            </SelectTrigger>
                            <SelectContent>
                              {jobApplicationTimelineCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {translateTimelineCategory(locale, category)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      </div>
                      <div className="grid gap-3">
                        <Field>
                          <Label htmlFor={`timeline-title-${entry.id}`}>
                            {t('form.title')}
                          </Label>
                          <Input
                            id={`timeline-title-${entry.id}`}
                            value={entry.title}
                            onChange={(event) =>
                              updateTimelineEntry(entry.id, 'title', event.target.value)
                            }
                            className={fieldClassName}
                            placeholder={t('form.timelineTitlePlaceholder')}
                          />
                        </Field>
                      </div>
                      <Field>
                        <Label htmlFor={`timeline-description-${entry.id}`}>
                          {t('form.description')}
                        </Label>
                        <Textarea
                          id={`timeline-description-${entry.id}`}
                          value={entry.description}
                          onChange={(event) =>
                            updateTimelineEntry(
                              entry.id,
                              'description',
                              event.target.value,
                            )
                          }
                          className={`min-h-24 ${fieldClassName}`}
                          placeholder={t('form.timelineDescriptionPlaceholder')}
                        />
                      </Field>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-2xl border border-dashed border-border/70 bg-background/60 p-4 text-sm text-muted-foreground dark:border-white/[0.05] dark:bg-[#111214]">
                  <IconCalendarEvent className="mt-0.5 size-4 shrink-0" />
                  {t('form.noActivityYet')}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={loading || isSubmitting}
                className="dark:bg-blue-600 dark:text-white dark:shadow-[0_12px_30px_rgba(37,99,235,0.28)] dark:hover:bg-blue-500"
              >
                <IconDeviceFloppy className="size-4" />
                {isSubmitting ? submittingLabel : submitLabel}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-2">{children}</div>
}
