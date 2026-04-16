'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  IconBriefcase,
  IconBuildingSkyscraper,
  IconCalendarEvent,
  IconChartBar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLink,
  IconMapPin,
  IconPlus,
  IconProgress,
  IconSearch,
  IconTimeline,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { toast } from 'sonner'
import { z } from 'zod'
import { useI18n } from '@/components/locale-provider'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  jobApplicationStatuses,
  type JobApplicationTimelineCategory,
  type JobApplicationSource,
  type JobApplicationStatus,
} from '@/lib/job-applications'
import {
  getLocaleDateFormat,
  translateJobType,
  translateSource,
  translateStatus,
  translateTimelineCategory,
  translateWorkModel,
} from '@/lib/i18n'
import {
  deleteJobApplication,
  updateJobApplicationStatus,
} from '@/lib/job-applications-db'
import { useJobApplications } from '@/hooks/use-job-applications'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

const applicationSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  jobTitle: z.string(),
  jobType: z.enum(['Full-time', 'Internship', 'Contract', 'Freelance']),
  workModel: z.enum(['Remote', 'Hybrid', 'On-site']),
  location: z.string(),
  salaryRange: z.string(),
  source: z.enum([
    'LinkedIn',
    'Glints',
    'Jobstreet',
    'Referral',
    'Company Website',
  ]),
  applicationDate: z.string(),
  followUpDate: z.string().optional(),
  status: z.enum([
    'Applied',
    'Screening',
    'Interview',
    'Assessment',
    'Offer',
    'Rejected',
  ]),
  notes: z.string(),
  jobLink: z.string(),
  recruiterContact: z.string(),
  timeline: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      category: z.enum([
        'Applied',
        'Recruiter Reply',
        'Interview',
        'Assessment',
        'Offer',
        'Follow-up',
        'Status Change',
        'Rejection',
      ]),
      title: z.string(),
      description: z.string(),
    }),
  ),
})

type ApplicationRecord = z.infer<typeof applicationSchema>

const chartData = [
  { month: 'Jan', submitted: 2, interviews: 0 },
  { month: 'Feb', submitted: 4, interviews: 1 },
  { month: 'Mar', submitted: 6, interviews: 2 },
  { month: 'Apr', submitted: 8, interviews: 3 },
]

const chartConfig = {
  submitted: {
    label: 'Submitted',
    color: 'var(--primary)',
  },
  interviews: {
    label: 'Interview Stages',
    color: 'oklch(0.72 0.16 245)',
  },
} satisfies ChartConfig

function formatDate(date: string, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trimEnd()}...`
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

function getSourceBadge(source: JobApplicationSource) {
  switch (source) {
    case 'LinkedIn':
      return 'border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300'
    case 'Glints':
      return 'border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300'
    case 'Jobstreet':
      return 'border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
    case 'Referral':
      return 'border-orange-500/25 bg-orange-500/10 text-orange-700 dark:text-orange-300'
    default:
      return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
  }
}

function getTimelineCategoryBadge(category: JobApplicationTimelineCategory) {
  switch (category) {
    case 'Applied':
      return 'border-slate-500/25 bg-slate-500/10 text-slate-700 dark:text-slate-300'
    case 'Recruiter Reply':
      return 'border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
    case 'Interview':
      return 'border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300'
    case 'Assessment':
      return 'border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300'
    case 'Offer':
      return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
    case 'Follow-up':
      return 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300'
    case 'Status Change':
      return 'border-indigo-500/25 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
    case 'Rejection':
      return 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300'
    default:
      return 'border-border bg-muted text-muted-foreground'
  }
}

function DragHandle({ id }: { id: UniqueIdentifier }) {
  const { attributes, listeners } = useSortable({ id })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <IconGripVertical className="size-3.5" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

function ApplicationViewer({
  item,
  onEdit,
}: {
  item: ApplicationRecord
  onEdit: (application: ApplicationRecord) => void | Promise<void>
}) {
  const isMobile = useIsMobile()
  const { locale, t } = useI18n()
  const dateLocale = getLocaleDateFormat(locale)

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="h-auto justify-start px-0 text-left text-foreground"
        >
          <div className="flex flex-col items-start">
            <span className="font-semibold">{item.companyName}</span>
            <span className="text-xs text-muted-foreground">{item.jobTitle}</span>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-screen">
        <DrawerHeader className="gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getStatusBadge(item.status)} variant="outline">
              {item.status === 'Offer' && (
                <IconCircleCheckFilled className="size-3.5 fill-current" />
              )}
              {translateStatus(locale, item.status)}
            </Badge>
            <Badge className={getSourceBadge(item.source)} variant="outline">
              {translateSource(locale, item.source)}
            </Badge>
          </div>
          <DrawerTitle className="text-xl">
            {item.companyName} - {item.jobTitle}
          </DrawerTitle>
          <DrawerDescription>
            Submitted on {formatDate(item.applicationDate)} · {item.workModel} ·{' '}
            {item.location}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-5 overflow-y-auto px-4 pb-2 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig} className="aspect-[16/6]">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ left: 0, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="submitted"
                    type="natural"
                    fill="var(--color-submitted)"
                    fillOpacity={0.18}
                    stroke="var(--color-submitted)"
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="interviews"
                    type="natural"
                    fill="var(--color-interviews)"
                    fillOpacity={0.12}
                    stroke="var(--color-interviews)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
              <div className="grid gap-2 rounded-xl border bg-muted/20 p-4">
                <div className="flex items-center gap-2 font-medium">
                  Pipeline momentum
                  <IconTrendingUp className="size-4" />
                </div>
                <p className="text-muted-foreground">
                  This application is currently in <strong>{item.status}</strong>.
                  Keep recruiter communication warm and track follow-up dates in
                  your notes.
                </p>
              </div>
              <Separator />
            </>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard
              icon={<IconBuildingSkyscraper className="size-4" />}
              label={t('applications.companyName')}
              value={item.companyName}
            />
            <InfoCard
              icon={<IconBriefcase className="size-4" />}
              label={t('applications.jobTitle')}
              value={item.jobTitle}
            />
            <InfoCard label={t('applications.jobType')} value={translateJobType(locale, item.jobType)} />
            <InfoCard label={t('applications.workModel')} value={translateWorkModel(locale, item.workModel)} />
            <InfoCard
              icon={<IconMapPin className="size-4" />}
              label={t('applications.location')}
              value={item.location}
            />
            <InfoCard label={t('applications.salary')} value={item.salaryRange} />
            <InfoCard label={t('applications.source')} value={translateSource(locale, item.source)} />
            <InfoCard
              icon={<IconCalendarEvent className="size-4" />}
              label={t('applications.appliedOn')}
              value={formatDate(item.applicationDate, dateLocale)}
            />
            <InfoCard
              icon={<IconCalendarEvent className="size-4" />}
              label={t('applications.followUpDate')}
              value={item.followUpDate ? formatDate(item.followUpDate, dateLocale) : t('applications.notSet')}
            />
            <InfoCard label={t('applications.status')} value={translateStatus(locale, item.status)} />
            <InfoCard
              icon={<IconUsers className="size-4" />}
              label={t('applications.recruiter')}
              value={item.recruiterContact}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor={`notes-${item.id}`}>{t('applications.notes')}</Label>
            <Textarea
              id={`notes-${item.id}`}
              defaultValue={item.notes}
              className="min-h-32"
            />
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <IconTimeline className="size-4 text-primary" />
              <Label>{t('applications.activityTimeline')}</Label>
            </div>
            {item.timeline.length ? (
              <div className="grid gap-3">
                {[...item.timeline]
                  .sort((left, right) => right.date.localeCompare(left.date))
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-xl border bg-muted/20 p-4"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <Badge
                            variant="outline"
                            className={getTimelineCategoryBadge(entry.category)}
                          >
                            {translateTimelineCategory(locale, entry.category)}
                          </Badge>
                          <div className="font-medium">{entry.title}</div>
                        </div>
                        <div className="text-xs text-muted-foreground sm:pt-1">
                          {formatDate(entry.date, dateLocale)}
                        </div>
                      </div>
                      {entry.description ? (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {entry.description}
                        </p>
                      ) : null}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed bg-muted/10 p-4 text-sm text-muted-foreground">
                {t('applications.noActivity')}
              </div>
            )}
          </div>

          <div className="grid gap-3">
            <Label>{t('applications.jobLink')}</Label>
            <Link
              href={item.jobLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <IconLink className="size-4" />
              {t('applications.openJobPosting')}
            </Link>
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={() => void onEdit(item)}>
            {t('applications.editApplication')}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">{t('common.done')}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <div className="mb-1 flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {icon}
        {label}
      </div>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  )
}

function DraggableRow({ row }: { row: Row<ApplicationRecord> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      ref={setNodeRef}
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

function KanbanCard({
  application,
  onEdit,
}: {
  application: ApplicationRecord
  onEdit: (application: ApplicationRecord) => void
}) {
  const { locale, t } = useI18n()
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: application.id,
      data: {
        type: 'application',
        applicationId: application.id,
        status: application.status,
      },
    })

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={() => onEdit(application)}
      className="w-full rounded-xl border border-black/5 bg-background p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/[0.06] dark:bg-[#15171c] dark:hover:bg-[#191c22]"
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
      }}
      {...listeners}
      {...attributes}
    >
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{application.jobTitle}</div>
        <div className="mt-1 truncate text-xs text-muted-foreground">
          {application.companyName}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="px-1.5 text-[10px] text-muted-foreground">
          {translateWorkModel(locale, application.workModel)}
        </Badge>
        <Badge variant="outline" className="px-1.5 text-[10px] text-muted-foreground">
          {translateJobType(locale, application.jobType)}
        </Badge>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
        <span>{formatDate(application.applicationDate, getLocaleDateFormat(locale))}</span>
        {application.followUpDate ? (
          <>
            <span>•</span>
            <span>Follow-up {formatDate(application.followUpDate)}</span>
          </>
        ) : null}
      </div>
    </button>
  )
}

function KanbanColumn({
  status,
  items,
  onEdit,
}: {
  status: JobApplicationStatus
  items: ApplicationRecord[]
  onEdit: (application: ApplicationRecord) => void
}) {
  const { locale, t } = useI18n()
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'status-column',
      status,
    },
  })

  return (
    <div className="flex w-[272px] shrink-0 flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="text-base font-semibold tracking-tight">
            {translateStatus(locale, status)}
          </div>
          <div className="text-xs text-muted-foreground">
            {items.length} application{items.length === 1 ? '' : 's'}
          </div>
        </div>
        <div
          className={`flex size-8 items-center justify-center rounded-full border text-xs font-medium ${
            status === 'Applied'
              ? 'border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-300'
              : status === 'Screening'
                ? 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                : status === 'Interview' || status === 'Assessment'
                  ? 'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300'
                  : status === 'Offer'
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300'
          }`}
        >
          {items.length}
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={`flex min-h-[180px] flex-col gap-3 rounded-2xl border p-3 transition ${
          isOver
            ? 'border-primary/40 bg-primary/5 dark:border-blue-400/35 dark:bg-blue-500/8'
            : 'border-black/5 bg-muted/35 dark:border-white/[0.05] dark:bg-[#101216]/90'
        }`}
      >
        {items.length ? (
          items.map((application) => (
            <KanbanCard
              key={application.id}
              application={application}
              onEdit={onEdit}
            />
          ))
        ) : (
          <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-dashed text-sm text-muted-foreground dark:border-white/[0.05]">
            {t('applications.dropHere')}
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  caption,
  tone = 'blue',
  icon,
}: {
  label: string
  value: string
  caption: string
  tone?: 'blue' | 'green' | 'amber' | 'indigo'
  icon: React.ReactNode
}) {
  const toneClassMap = {
    blue:
      'dark:border-white/[0.035] dark:bg-[linear-gradient(135deg,rgba(37,99,235,0.09),rgba(17,17,19,0.96)_68%)] dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.18)]',
    green:
      'dark:border-white/[0.035] dark:bg-[linear-gradient(135deg,rgba(22,163,74,0.09),rgba(17,17,19,0.96)_68%)] dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.18)]',
    amber:
      'dark:border-white/[0.035] dark:bg-[linear-gradient(135deg,rgba(217,119,6,0.09),rgba(17,17,19,0.96)_68%)] dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.18)]',
    indigo:
      'dark:border-white/[0.035] dark:bg-[linear-gradient(135deg,rgba(79,70,229,0.09),rgba(17,17,19,0.96)_68%)] dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.18)]',
  } as const

  const iconToneClassMap = {
    blue: 'bg-blue-500/18 text-blue-400',
    green: 'bg-emerald-500/18 text-emerald-400',
    amber: 'bg-orange-500/18 text-orange-400',
    indigo: 'bg-indigo-500/18 text-indigo-400',
  } as const

  return (
    <div
      className={`min-w-0 rounded-3xl border bg-card px-5 py-5 shadow-sm transition-colors dark:shadow-black/30 ${toneClassMap[tone]}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${iconToneClassMap[tone]}`}
        >
          {icon}
        </div>
        <div className="min-w-0 pt-0.5">
          <div className="truncate text-sm font-medium text-muted-foreground">
            {label}
          </div>
          <div className="mt-1 text-3xl font-semibold leading-none text-foreground">
            {value}
          </div>
          <div className="mt-3 line-clamp-2 text-sm text-muted-foreground/90">
            {caption}
          </div>
        </div>
      </div>
    </div>
  )
}

export function JobApplicationsTable() {
  const router = useRouter()
  const { locale, t } = useI18n()
  const { applications, loading, error, user } = useJobApplications()
  const [data, setData] = React.useState<ApplicationRecord[]>([])
  const [pendingDelete, setPendingDelete] =
    React.useState<ApplicationRecord | null>(null)
  const [activeKanbanId, setActiveKanbanId] = React.useState<string | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'applicationDate', desc: true },
  ])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data.map(({ id }) => id),
    [data],
  )

  React.useEffect(() => {
    setData(applications.map((item) => applicationSchema.parse(item)))
  }, [applications])

  const statusCounts = React.useMemo(() => {
    return data.reduce<Record<JobApplicationStatus, number>>(
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
  }, [data])

  const kanbanColumns = React.useMemo(() => {
    return jobApplicationStatuses.map((status) => ({
      status,
      items: data
        .filter((item) => item.status === status)
        .sort((left, right) =>
          right.applicationDate.localeCompare(left.applicationDate),
        ),
    }))
  }, [data])

  const activeKanbanApplication = React.useMemo(
    () => data.find((item) => item.id === activeKanbanId) ?? null,
    [activeKanbanId, data],
  )

  const handleDelete = React.useCallback(
    (application: ApplicationRecord) => {
      if (!user) {
        toast.error(t('applications.deleteFailed'))
        return
      }

      setPendingDelete(application)
    },
    [user],
  )

  const confirmDelete = React.useCallback(async () => {
    if (!user || !pendingDelete) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteJobApplication(user.uid, pendingDelete.id)
      toast.success(t('applications.deleteSuccess'))
      setPendingDelete(null)
    } catch (nextError) {
      toast.error(
        nextError instanceof Error
          ? nextError.message
          : t('applications.deleteFailed'),
      )
    } finally {
      setIsDeleting(false)
    }
  }, [pendingDelete, user])

  const handleOpenEdit = React.useCallback(
    (application: ApplicationRecord) => {
      router.push(`/dashboard/applications/${application.id}/edit`)
    },
    [router],
  )

  const handlePipelineDragStart = React.useCallback((event: DragStartEvent) => {
    setActiveKanbanId(String(event.active.id))
  }, [])

  const handlePipelineDragEnd = React.useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      setActiveKanbanId(null)

      if (!over || !user) {
        return
      }

      const applicationId = String(active.id)
      const nextStatus = String(over.id) as JobApplicationStatus
      const currentApplication = data.find((item) => item.id === applicationId)

      if (!currentApplication || currentApplication.status === nextStatus) {
        return
      }

      setData((current) =>
        current.map((item) =>
          item.id === applicationId ? { ...item, status: nextStatus } : item,
        ),
      )
      setIsUpdatingStatus(true)

      try {
        await updateJobApplicationStatus(user.uid, applicationId, nextStatus)
        toast.success(
          `${currentApplication.companyName} ${t('applications.status')} ${translateStatus(locale, nextStatus)}.`,
        )
      } catch (nextError) {
        setData((current) =>
          current.map((item) =>
            item.id === applicationId
              ? { ...item, status: currentApplication.status }
              : item,
          ),
        )
        toast.error(
          nextError instanceof Error
            ? nextError.message
            : t('applications.statusUpdateFailed'),
        )
      } finally {
        setIsUpdatingStatus(false)
      }
    },
    [data, user],
  )

  const columns = React.useMemo<ColumnDef<ApplicationRecord>[]>(
    () => [
      {
        id: 'drag',
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: 'select',
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'companyName',
        header: 'Application',
        cell: ({ row }) => (
          <ApplicationViewer item={row.original} onEdit={handleOpenEdit} />
        ),
        enableHiding: false,
      },
      {
        accessorKey: 'jobType',
        header: t('applications.jobType'),
        cell: ({ row }) => (
          <Badge variant="outline" className="px-2">
            {translateJobType(locale, row.original.jobType)}
          </Badge>
        ),
      },
      {
        accessorKey: 'workModel',
        header: t('applications.workModel'),
        cell: ({ row }) => translateWorkModel(locale, row.original.workModel),
      },
      {
        accessorKey: 'location',
        header: t('applications.location'),
        cell: ({ row }) => (
          <div className="max-w-40 truncate">{row.original.location}</div>
        ),
      },
      {
        accessorKey: 'applicationDate',
        header: t('applications.appliedOn'),
        cell: ({ row }) => formatDate(row.original.applicationDate, getLocaleDateFormat(locale)),
      },
      {
        accessorKey: 'salaryRange',
        header: t('applications.salary'),
        cell: ({ row }) => (
          <div className="min-w-[220px] whitespace-nowrap text-sm">
            {row.original.salaryRange}
          </div>
        ),
      },
      {
        accessorKey: 'source',
        header: t('applications.source'),
        cell: ({ row }) => (
          <Badge variant="outline" className={getSourceBadge(row.original.source)}>
            {translateSource(locale, row.original.source)}
          </Badge>
        ),
      },
      {
        accessorKey: 'notes',
        header: t('applications.notes'),
        cell: ({ row }) => (
          <div className="max-w-72 whitespace-normal text-sm text-muted-foreground">
            {truncateText(row.original.notes, 45)}
          </div>
        ),
      },
      {
        accessorKey: 'jobLink',
        header: t('applications.jobLink'),
        cell: ({ row }) => (
          <Link
            href={row.original.jobLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <IconLink className="size-4" />
            {t('common.open')}
          </Link>
        ),
      },
      {
        accessorKey: 'recruiterContact',
        header: t('applications.recruiter'),
        cell: ({ row }) => (
          <div className="max-w-56 whitespace-normal text-sm">
            {row.original.recruiterContact}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: t('applications.status'),
        cell: ({ row }) => (
          <Badge variant="outline" className={getStatusBadge(row.original.status)}>
            {row.original.status === 'Offer' && (
              <IconCircleCheckFilled className="size-3.5 fill-current" />
            )}
            {translateStatus(locale, row.original.status)}
          </Badge>
        ),
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground data-[state=open]:bg-muted"
              >
                <IconDotsVertical className="size-4" />
                <span className="sr-only">{t('common.open')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={() => void handleOpenEdit(row.original)}
              >
                {t('common.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={row.original.jobLink} target="_blank" rel="noreferrer">
                  {t('applications.openJobPosting')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => void handleDelete(row.original)}
              >
                {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleDelete, handleOpenEdit, locale, t],
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active && over && active.id !== over.id) {
      setData((current) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(current, oldIndex, newIndex)
      })
    }
  }

  return (
    <>
      <Tabs defaultValue="applications" className="w-full gap-6">
        <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('applications.title')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('applications.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 @xl/main:grid-cols-2 @4xl/main:grid-cols-3 @6xl/main:grid-cols-4">
          <SummaryCard
            label={t('applications.totalApplications')}
            value={String(data.length)}
            caption={t('applications.allSubmitted')}
            tone="blue"
            icon={<IconChartBar className="size-7" />}
          />
          <SummaryCard
            label={t('applications.interviewStages')}
            value={String(statusCounts.Interview + statusCounts.Assessment)}
            caption={t('applications.needFollowUp')}
            tone="green"
            icon={<IconCircleCheckFilled className="size-7" />}
          />
          <SummaryCard
            label={t('dashboard.offers')}
            value={String(statusCounts.Offer)}
            caption={t('applications.activeNegotiation')}
            tone="amber"
            icon={<IconCalendarEvent className="size-7" />}
          />
          <SummaryCard
            label={t('applications.responseRate')}
            value={`${data.length ? Math.round(((data.length - statusCounts.Applied) / data.length) * 100) : 0}%`}
            caption={t('applications.movedBeyondApplied')}
            tone="indigo"
            icon={<IconProgress className="size-7" />}
          />
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-end mt-6">
          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            <TabsList>
              <TabsTrigger value="applications">{t('common.applications')}</TabsTrigger>
              <TabsTrigger value="pipeline">
                {t('applications.pipeline')} <Badge variant="secondary">{data.length}</Badge>
              </TabsTrigger>
            </TabsList>
            <Button asChild>
              <Link href="/dashboard/applications/create">
              <IconPlus className="size-4" />
              {t('applications.addApplication')}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <TabsContent
        value="applications"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder={t('applications.searchPlaceholder')}
                value={
                  (table.getColumn('companyName')?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  table.getColumn('companyName')?.setFilterValue(event.target.value)
                }
              />
            </div>
            <Select
              onValueChange={(value) =>
                table
                  .getColumn('status')
                  ?.setFilterValue(value === 'all' ? undefined : value)
              }
              defaultValue="all"
            >
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder={t('applications.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('applications.allStatuses')}</SelectItem>
                <SelectItem value="Applied">{translateStatus(locale, 'Applied')}</SelectItem>
                <SelectItem value="Screening">{translateStatus(locale, 'Screening')}</SelectItem>
                <SelectItem value="Interview">{translateStatus(locale, 'Interview')}</SelectItem>
                <SelectItem value="Assessment">{translateStatus(locale, 'Assessment')}</SelectItem>
                <SelectItem value="Offer">{translateStatus(locale, 'Offer')}</SelectItem>
                <SelectItem value="Rejected">{translateStatus(locale, 'Rejected')}</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                table
                  .getColumn('source')
                  ?.setFilterValue(value === 'all' ? undefined : value)
              }
              defaultValue="all"
            >
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder={t('applications.source')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('applications.allSources')}</SelectItem>
                <SelectItem value="LinkedIn">{translateSource(locale, 'LinkedIn')}</SelectItem>
                <SelectItem value="Glints">{translateSource(locale, 'Glints')}</SelectItem>
                <SelectItem value="Jobstreet">{translateSource(locale, 'Jobstreet')}</SelectItem>
                <SelectItem value="Referral">{translateSource(locale, 'Referral')}</SelectItem>
                <SelectItem value="Company Website">{translateSource(locale, 'Company Website')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns className="size-4" />
                {t('common.columns')}
                <IconChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== 'undefined' && column.getCanHide(),
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl border bg-card/70 shadow-sm dark:border-white/5 dark:bg-[#171717]/95">
          <DndContext
            id={sortableId}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur dark:bg-[#1f1f1f]/95">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {t('applications.loading')}
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {t('applications.notFound')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {t('applications.selectedRows', {
              selected: table.getFilteredSelectedRowModel().rows.length,
              total: table.getFilteredRowModel().rows.length,
            })}
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                {t('applications.rowsPerPage')}
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              {t('applications.pageOf', {
                current: table.getState().pagination.pageIndex + 1,
                total: table.getPageCount(),
              })}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden size-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="pipeline" className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{t('applications.kanbanTitle')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('applications.kanbanDescription')}
            </p>
          </div>
          {isUpdatingStatus ? (
            <Badge variant="secondary">{t('applications.updatingStatus')}</Badge>
          ) : null}
        </div>

        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragStart={handlePipelineDragStart}
          onDragEnd={handlePipelineDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-2">
            {kanbanColumns.map((column) => (
              <KanbanColumn
                key={column.status}
                status={column.status}
                items={column.items}
                onEdit={handleOpenEdit}
              />
            ))}
          </div>
          <DragOverlay>
            {activeKanbanApplication ? (
              <div className="w-[280px] rotate-1">
                <KanbanCard
                  application={activeKanbanApplication}
                  onEdit={handleOpenEdit}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </TabsContent>

      <TabsContent value="insights" className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
          <div className="rounded-2xl border bg-card p-5 shadow-sm dark:border-white/5 dark:bg-[#181818]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Submission trend</h3>
              <p className="text-sm text-muted-foreground">
                High-level view of submitted applications and interviews.
              </p>
            </div>
            <ChartContainer config={chartConfig} className="aspect-[16/7]">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{ left: 8, right: 8 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="submitted"
                  type="natural"
                  fill="var(--color-submitted)"
                  fillOpacity={0.15}
                  stroke="var(--color-submitted)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="interviews"
                  type="natural"
                  fill="var(--color-interviews)"
                  fillOpacity={0.12}
                  stroke="var(--color-interviews)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
          <div className="rounded-2xl border bg-card p-5 shadow-sm dark:border-white/5 dark:bg-[#181818]">
            <h3 className="text-lg font-semibold">Top notes</h3>
            <div className="mt-4 space-y-3">
              {data.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border bg-muted/20 p-4 dark:border-white/5 dark:bg-[#121212]"
                >
                  <div className="font-medium">
                    {item.companyName} · {item.jobTitle}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setPendingDelete(null)
          }
        }}
      >
        <AlertDialogContent className="border-border bg-background/95 shadow-2xl dark:border-white/[0.05] dark:bg-[linear-gradient(135deg,rgba(30,33,46,0.94)_0%,rgba(17,17,19,0.98)_78%)] dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.3)]">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('applications.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? t('applications.deleteConfirmDescription', {
                    company: pendingDelete.companyName,
                    title: pendingDelete.jobTitle,
                  })
                : t('applications.deleteConfirmTitle')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
              disabled={isDeleting}
            >
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:shadow-[0_12px_30px_rgba(220,38,38,0.22)]"
              onClick={(event) => {
                event.preventDefault()
                void confirmDelete()
              }}
            >
              {isDeleting ? t('applications.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
