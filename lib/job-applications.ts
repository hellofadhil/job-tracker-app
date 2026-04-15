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
}

export type JobApplicationFormValues = Omit<JobApplication, 'id'>

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
  },
]
