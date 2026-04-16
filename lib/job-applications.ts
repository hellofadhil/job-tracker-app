export type JobApplicationStatus =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Assessment'
  | 'Offer'
  | 'Rejected'

export type JobApplicationType =
  | 'Full-time'
  | 'Internship'
  | 'Contract'
  | 'Freelance'

export type WorkModel = 'Remote' | 'Hybrid' | 'On-site'

export type JobApplicationSource =
  | 'LinkedIn'
  | 'Glints'
  | 'Jobstreet'
  | 'Referral'
  | 'Company Website'

export type JobApplicationTimelineCategory =
  | 'Applied'
  | 'Recruiter Reply'
  | 'Interview'
  | 'Assessment'
  | 'Offer'
  | 'Follow-up'
  | 'Status Change'
  | 'Rejection'

export type JobApplicationTimelineEntry = {
  id: string
  date: string
  category: JobApplicationTimelineCategory
  title: string
  description: string
}

export const jobApplicationStatuses: JobApplicationStatus[] = [
  'Applied',
  'Screening',
  'Interview',
  'Assessment',
  'Offer',
  'Rejected',
]

export const jobApplicationTypes: JobApplicationType[] = [
  'Full-time',
  'Internship',
  'Contract',
  'Freelance',
]

export const workModels: WorkModel[] = ['Remote', 'Hybrid', 'On-site']

export const jobApplicationSources: JobApplicationSource[] = [
  'LinkedIn',
  'Glints',
  'Jobstreet',
  'Referral',
  'Company Website',
]

export const jobApplicationTimelineCategories: JobApplicationTimelineCategory[] = [
  'Applied',
  'Recruiter Reply',
  'Interview',
  'Assessment',
  'Offer',
  'Follow-up',
  'Status Change',
  'Rejection',
]

export type JobApplication = {
  id: string
  companyName: string
  jobTitle: string
  jobType: JobApplicationType
  workModel: WorkModel
  location: string
  salaryRange: string
  source: JobApplicationSource
  applicationDate: string
  followUpDate?: string
  status: JobApplicationStatus
  notes: string
  jobLink: string
  recruiterContact: string
  timeline: JobApplicationTimelineEntry[]
}

export type JobApplicationFormValues = Omit<JobApplication, 'id'>

export function createTimelineEntry(
  date: string,
  category: JobApplicationTimelineCategory,
  title: string,
  description: string,
): JobApplicationTimelineEntry {
  return {
    id: crypto.randomUUID(),
    date,
    category,
    title,
    description,
  }
}

export function ensureTimelineEntries(
  timeline: Partial<JobApplicationTimelineEntry>[] | undefined,
): JobApplicationTimelineEntry[] {
  if (!timeline?.length) {
    return []
  }

  return timeline
    .filter(
      (entry): entry is Partial<JobApplicationTimelineEntry> =>
        Boolean(entry?.date && entry?.title),
    )
    .map((entry) => ({
      id: entry.id ?? crypto.randomUUID(),
      date: entry.date ?? '',
      category:
        (entry.category as JobApplicationTimelineCategory | undefined) ??
        'Follow-up',
      title: entry.title ?? '',
      description: entry.description ?? '',
    }))
}

export const jobApplications: JobApplication[] = [
  {
    id: '1',
    companyName: 'Tokopedia',
    jobTitle: 'Frontend Engineer',
    jobType: 'Full-time',
    workModel: 'Hybrid',
    location: 'Jakarta, Indonesia',
    salaryRange: 'Rp 12.000.000 - 18.000.000 / month',
    source: 'LinkedIn',
    applicationDate: '2026-04-10',
    followUpDate: '2026-04-16',
    status: 'Interview',
    notes:
      'Building React-based seller dashboard. Strong preference for TypeScript, testing, and design system experience.',
    jobLink: 'https://www.linkedin.com/jobs/view/frontend-engineer-tokopedia',
    recruiterContact: 'Alya Putri - alya.putri@tokopedia.com',
    timeline: [
      createTimelineEntry(
        '2026-04-10',
        'Applied',
        'Application submitted',
        'Applied through LinkedIn with frontend-focused CV version.',
      ),
      createTimelineEntry(
        '2026-04-12',
        'Recruiter Reply',
        'Recruiter replied',
        'Recruiter confirmed profile fit and asked for availability.',
      ),
      createTimelineEntry(
        '2026-04-14',
        'Interview',
        'Interview scheduled',
        'First interview booked for product and frontend collaboration fit.',
      ),
    ],
  },
  {
    id: '2',
    companyName: 'Gojek',
    jobTitle: 'Product Designer Intern',
    jobType: 'Internship',
    workModel: 'Hybrid',
    location: 'Jakarta, Indonesia',
    salaryRange: 'Rp 4.000.000 - 6.000.000 / month',
    source: 'Company Website',
    applicationDate: '2026-04-08',
    followUpDate: '2026-04-15',
    status: 'Screening',
    notes:
      'Portfolio-heavy role for mobility team. Needs strong UX case studies and Figma systems thinking.',
    jobLink: 'https://careers.gojek.com/product-designer-intern',
    recruiterContact: 'recruitment@gojek.com',
    timeline: [
      createTimelineEntry(
        '2026-04-08',
        'Applied',
        'Application submitted',
        'Submitted internship application from company careers page.',
      ),
      createTimelineEntry(
        '2026-04-11',
        'Recruiter Reply',
        'Portfolio shortlisted',
        'Recruitment moved portfolio review into screening stage.',
      ),
    ],
  },
  {
    id: '3',
    companyName: 'Traveloka',
    jobTitle: 'UI Engineer',
    jobType: 'Contract',
    workModel: 'Remote',
    location: 'Indonesia',
    salaryRange: 'Rp 10.000.000 - 14.000.000 / month',
    source: 'Referral',
    applicationDate: '2026-04-06',
    followUpDate: '2026-04-14',
    status: 'Assessment',
    notes:
      'Short-term contract to help redesign booking flows. Includes take-home React exercise.',
    jobLink: 'https://www.traveloka.com/careers/ui-engineer-contract',
    recruiterContact: 'Referral via Dimas Rahman',
    timeline: [
      createTimelineEntry(
        '2026-04-06',
        'Applied',
        'Application submitted',
        'Referral intro sent together with portfolio and React examples.',
      ),
      createTimelineEntry(
        '2026-04-09',
        'Assessment',
        'Assessment shared',
        'Received take-home assignment for booking flow redesign.',
      ),
    ],
  },
  {
    id: '4',
    companyName: 'Ruangguru',
    jobTitle: 'UX Writer',
    jobType: 'Freelance',
    workModel: 'Remote',
    location: 'Bandung, Indonesia',
    salaryRange: 'Rp 250.000 / day',
    source: 'Glints',
    applicationDate: '2026-04-05',
    followUpDate: '',
    status: 'Applied',
    notes:
      'Freelance content and product microcopy support for learning app onboarding and premium conversion.',
    jobLink: 'https://glints.com/jobs/ux-writer-ruangguru',
    recruiterContact: 'Nadia Sari - hiring@ruangguru.com',
    timeline: [
      createTimelineEntry(
        '2026-04-05',
        'Applied',
        'Application submitted',
        'Applied from Glints with UX writing portfolio link.',
      ),
    ],
  },
  {
    id: '5',
    companyName: 'Xendit',
    jobTitle: 'Product Operations Analyst',
    jobType: 'Full-time',
    workModel: 'On-site',
    location: 'Jakarta, Indonesia',
    salaryRange: 'Rp 9.000.000 - 13.000.000 / month',
    source: 'Jobstreet',
    applicationDate: '2026-04-03',
    followUpDate: '',
    status: 'Rejected',
    notes:
      'Operations role focused on merchant onboarding metrics. Rejection arrived after recruiter call.',
    jobLink: 'https://www.jobstreet.co.id/job/product-operations-analyst-xendit',
    recruiterContact: 'talent@xendit.co',
    timeline: [
      createTimelineEntry(
        '2026-04-03',
        'Applied',
        'Application submitted',
        'Applied via Jobstreet for product operations role.',
      ),
      createTimelineEntry(
        '2026-04-07',
        'Rejection',
        'Rejection received',
        'Recruiter closed the process after initial call.',
      ),
    ],
  },
  {
    id: '6',
    companyName: 'Mekari',
    jobTitle: 'React Developer',
    jobType: 'Full-time',
    workModel: 'Hybrid',
    location: 'Jakarta, Indonesia',
    salaryRange: 'Rp 11.000.000 - 16.000.000 / month',
    source: 'LinkedIn',
    applicationDate: '2026-04-01',
    followUpDate: '2026-04-17',
    status: 'Offer',
    notes:
      'Offer stage after final interview. Team builds HR SaaS modules, performance review tools, and admin portals.',
    jobLink: 'https://www.linkedin.com/jobs/view/react-developer-mekari',
    recruiterContact: 'Kevin Tan - kevin.tan@mekari.com',
    timeline: [
      createTimelineEntry(
        '2026-04-01',
        'Applied',
        'Application submitted',
        'Applied with SaaS dashboard experience highlighted.',
      ),
      createTimelineEntry(
        '2026-04-08',
        'Interview',
        'Final interview completed',
        'Finished final round with product and engineering managers.',
      ),
      createTimelineEntry(
        '2026-04-12',
        'Offer',
        'Offer received',
        'Compensation package shared and waiting on decision.',
      ),
    ],
  },
  {
    id: '7',
    companyName: 'Sirclo',
    jobTitle: 'Frontend Developer',
    jobType: 'Full-time',
    workModel: 'Remote',
    location: 'Yogyakarta, Indonesia',
    salaryRange: 'Rp 8.000.000 - 12.000.000 / month',
    source: 'Company Website',
    applicationDate: '2026-03-29',
    followUpDate: '2026-04-15',
    status: 'Applied',
    notes:
      'E-commerce storefront team. Looking for Next.js, performance optimization, and accessibility experience.',
    jobLink: 'https://career.sirclo.com/frontend-developer',
    recruiterContact: 'talent.acquisition@sirclo.com',
    timeline: [
      createTimelineEntry(
        '2026-03-29',
        'Applied',
        'Application submitted',
        'Applied through company website with Next.js-heavy resume.',
      ),
    ],
  },
  {
    id: '8',
    companyName: 'Cakap',
    jobTitle: 'Growth Marketing Associate',
    jobType: 'Contract',
    workModel: 'Hybrid',
    location: 'Tangerang, Indonesia',
    salaryRange: 'Rp 7.000.000 - 9.000.000 / month',
    source: 'Glints',
    applicationDate: '2026-03-27',
    followUpDate: '',
    status: 'Screening',
    notes:
      'Performance marketing role with focus on B2C campaigns and landing page experiments.',
    jobLink: 'https://glints.com/jobs/growth-marketing-associate-cakap',
    recruiterContact: 'people@cakap.com',
    timeline: [
      createTimelineEntry(
        '2026-03-27',
        'Applied',
        'Application submitted',
        'Submitted application through Glints for growth marketing role.',
      ),
      createTimelineEntry(
        '2026-04-02',
        'Recruiter Reply',
        'Screening in progress',
        'Recruitment asked for campaign case study and metrics summary.',
      ),
    ],
  },
]
