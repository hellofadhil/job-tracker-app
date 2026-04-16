import type {
  JobApplicationSource,
  JobApplicationStatus,
  JobApplicationTimelineCategory,
  JobApplicationType,
  WorkModel,
} from '@/lib/job-applications'

export const locales = ['id', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'id'
export const localeCookieName = 'job-tracker-locale'

const dictionaries = {
  id: {
    'common.dashboard': 'Dashboard',
    'common.applications': 'Lamaran',
    'common.resources': 'Sumber Daya',
    'common.overview': 'Ringkasan',
    'common.create': 'Buat',
    'common.edit': 'Edit',
    'common.open': 'Buka',
    'common.done': 'Selesai',
    'common.cancel': 'Batal',
    'common.delete': 'Hapus',
    'common.columns': 'Kolom',
    'common.loading': 'Memuat...',
    'common.save': 'Simpan',
    'common.update': 'Perbarui',
    'common.language': 'Bahasa',
    'common.theme': 'Tema',
    'common.light': 'Terang',
    'common.dark': 'Gelap',
    'common.system': 'Sistem',
    'common.private': 'Private',
    'common.platform': 'Platform',
    'common.myTrackerJobs': 'My Tracker Jobs',
    'common.checkingSession': 'Memeriksa sesi...',
    'sidebar.dashboard': 'Dashboard',
    'sidebar.overview': 'Ringkasan',
    'sidebar.applications': 'Lamaran',
    'sidebar.resources': 'Sumber Daya',
    'auth.badge': 'My Job Tracker',
    'auth.loginTitle': 'Selamat datang kembali',
    'auth.registerTitle': 'Buat akunmu',
    'auth.forgotTitle': 'Reset password',
    'auth.loginDescription':
      'Masuk ke dashboard job tracker dengan email atau akun Google.',
    'auth.registerDescription':
      'Buat akun baru untuk mulai simpan dan track progress lamaran kerja.',
    'auth.forgotDescription':
      'Masukkan email akunmu, lalu kami kirim link reset password.',
    'auth.continueGoogle': 'Lanjutkan dengan Google',
    'auth.orUseEmail': 'atau pakai email',
    'auth.name': 'Nama',
    'auth.fullName': 'Nama lengkap',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Lupa password?',
    'auth.minPassword': 'Minimal 6 karakter',
    'auth.login': 'Login',
    'auth.register': 'Daftar',
    'auth.sendReset': 'Kirim link reset',
    'auth.noAccount': 'Belum punya akun?',
    'auth.haveAccount': 'Sudah punya akun?',
    'auth.rememberPassword': 'Sudah ingat password?',
    'auth.backToLogin': 'Kembali ke login',
    'auth.loginSuccess': 'Login berhasil.',
    'auth.googleSuccess': 'Login Google berhasil.',
    'auth.registerSuccess': 'Akun berhasil dibuat.',
    'auth.resetSent': 'Link reset password sudah dikirim ke email kamu.',
    'user.logoutSuccess': 'Kamu sudah logout.',
    'user.logoutFailed': 'Logout gagal. Coba lagi.',
    'user.upgrade': 'Upgrade ke Pro',
    'user.account': 'Akun',
    'user.billing': 'Tagihan',
    'user.notifications': 'Notifikasi',
    'user.logout': 'Keluar',
    'dashboard.title': 'Dashboard job tracker',
    'dashboard.description':
      'Jaga semua lamaran tetap bergerak dengan reminder live, follow-up date, dan satu next action yang jelas.',
    'dashboard.openApplications': 'Buka halaman lamaran',
    'dashboard.nextAction': 'Aksi Berikutnya',
    'dashboard.followUpWith': 'Follow up dengan {company}',
    'dashboard.dueToday': 'Jatuh tempo hari ini',
    'dashboard.overdue': 'Terlambat',
    'dashboard.openFollowUp': 'Buka follow-up',
    'dashboard.noFollowUpsTitle': 'Belum ada follow-up yang jatuh tempo',
    'dashboard.noFollowUpsDescription':
      'Kamu belum punya follow-up yang overdue atau jatuh tempo hari ini. Tambahkan follow-up date ke lamaran agar muncul di sini.',
    'dashboard.applicationsCount': 'Lamaran',
    'dashboard.interviewFlow': 'Sedang di Alur Interview',
    'dashboard.offers': 'Offer',
    'dashboard.remindersTitle': 'Reminder dashboard',
    'dashboard.remindersDescription':
      'Lamaran dengan follow-up yang overdue atau jatuh tempo hari ini.',
    'dashboard.followUpLabel': 'Follow-up',
    'dashboard.noReminders': 'Belum ada follow-up yang jatuh tempo.',
    'applications.title': 'Tracker lamaran kerja',
    'applications.description':
      'Pantau setiap submission, kontak recruiter, salary range, dan catatan pekerjaan dari satu tabel.',
    'applications.totalApplications': 'Total Lamaran',
    'applications.allSubmitted': 'Semua pekerjaan yang sudah masuk tracker',
    'applications.interviewStages': 'Tahap Interview',
    'applications.needFollowUp': 'Perlu follow-up minggu ini',
    'applications.activeNegotiation': 'Peluang negosiasi aktif',
    'applications.responseRate': 'Tingkat Respons',
    'applications.movedBeyondApplied': 'Sudah bergerak melewati tahap apply',
    'applications.pipeline': 'Pipeline',
    'applications.addApplication': 'Tambah Lamaran',
    'applications.searchPlaceholder':
      'Cari perusahaan, role, catatan, recruiter...',
    'applications.allStatuses': 'Semua status',
    'applications.allSources': 'Semua source',
    'applications.loading': 'Memuat lamaran...',
    'applications.notFound': 'Tidak ada lamaran ditemukan.',
    'applications.rowsPerPage': 'Baris per halaman',
    'applications.pageOf': 'Halaman {current} dari {total}',
    'applications.selectedRows':
      '{selected} dari {total} lamaran terpilih.',
    'applications.kanbanTitle': 'Kanban pipeline',
    'applications.kanbanDescription':
      'Geser kartu ke kolom lain untuk memperbarui status.',
    'applications.updatingStatus': 'Memperbarui status...',
    'applications.dropHere': 'Letakkan lamaran di sini',
    'applications.companyName': 'Nama Perusahaan',
    'applications.jobTitle': 'Judul Pekerjaan',
    'applications.jobType': 'Tipe Pekerjaan',
    'applications.workModel': 'Model Kerja',
    'applications.location': 'Lokasi',
    'applications.appliedOn': 'Tanggal Lamar',
    'applications.salary': 'Gaji',
    'applications.source': 'Source',
    'applications.followUpDate': 'Tanggal Follow-up',
    'applications.status': 'Status',
    'applications.notes': 'Deskripsi Pekerjaan / Catatan',
    'applications.recruiter': 'Recruiter / HR',
    'applications.jobLink': 'Link Lowongan',
    'applications.actions': 'Aksi',
    'applications.notSet': 'Belum diatur',
    'applications.openJobPosting': 'Buka lowongan',
    'applications.activityTimeline': 'Timeline Aktivitas',
    'applications.noActivity': 'Belum ada aktivitas tercatat.',
    'applications.editApplication': 'Edit lamaran',
    'applications.deleteConfirmTitle': 'Hapus lamaran?',
    'applications.deleteConfirmDescription':
      'Ini akan menghapus {company} - {title} secara permanen dari tracker. Aksi ini tidak bisa dibatalkan.',
    'applications.deleting': 'Menghapus...',
    'applications.deleteSuccess': 'Lamaran berhasil dihapus.',
    'applications.deleteFailed': 'Gagal menghapus lamaran.',
    'applications.statusUpdateFailed': 'Gagal memperbarui status.',
    'applications.createSuccess': 'Lamaran berhasil dibuat.',
    'applications.createFailed': 'Gagal membuat lamaran.',
    'applications.updateSuccess': 'Lamaran berhasil diperbarui.',
    'applications.updateFailed': 'Gagal memperbarui lamaran.',
    'applications.notFoundError': 'Lamaran tidak ditemukan.',
    'applications.loadFailed': 'Gagal memuat lamaran.',
    'form.newTrackerEntry': 'Entry Tracker Baru',
    'form.createTitle': 'Buat lamaran',
    'form.createDescription':
      'Tambahkan lamaran kerja baru dengan source, gaji, detail recruiter, dan catatan agar setiap peluang tetap rapi dari apply pertama sampai hasil akhir.',
    'form.saveApplication': 'Simpan Lamaran',
    'form.saving': 'Menyimpan...',
    'form.trackerUpdate': 'Pembaruan Tracker',
    'form.editTitle': 'Edit lamaran',
    'form.editDescription':
      'Perbarui role, kontak recruiter, salary range, dan catatan agar tracker tetap akurat di setiap tahap hiring.',
    'form.updateApplication': 'Perbarui Lamaran',
    'form.updating': 'Memperbarui...',
    'form.applicationDetails': 'Detail Lamaran',
    'form.applicationDetailsDescription':
      'Isi informasi utama pekerjaan persis seperti yang ingin kamu tampilkan di tracker.',
    'form.companyName': 'Nama Perusahaan',
    'form.jobTitle': 'Judul Pekerjaan',
    'form.jobType': 'Tipe Pekerjaan',
    'form.workModel': 'Model Kerja',
    'form.source': 'Source',
    'form.status': 'Status',
    'form.location': 'Lokasi',
    'form.applicationDate': 'Tanggal Lamar',
    'form.followUpDate': 'Tanggal Follow-up',
    'form.salary': 'Gaji',
    'form.recruiter': 'Recruiter / HR',
    'form.jobLink': 'Link Lowongan',
    'form.notes': 'Deskripsi Pekerjaan / Catatan',
    'form.activityTimeline': 'Timeline Aktivitas',
    'form.activityTimelineDescription':
      'Lacak balasan recruiter, interview, assessment, dan follow-up dalam urutan kronologis.',
    'form.addActivity': 'Tambah Aktivitas',
    'form.activity': 'Aktivitas',
    'form.remove': 'Hapus',
    'form.date': 'Tanggal',
    'form.category': 'Kategori',
    'form.title': 'Judul',
    'form.description': 'Deskripsi',
    'form.noActivityYet':
      'Belum ada aktivitas. Tambahkan entry untuk balasan recruiter, interview, assessment, atau follow-up penting.',
    'form.selectJobType': 'Pilih tipe pekerjaan',
    'form.selectWorkModel': 'Pilih model kerja',
    'form.selectSource': 'Pilih source',
    'form.selectStatus': 'Pilih status',
    'form.selectCategory': 'Pilih kategori',
    'form.companyPlaceholder': 'Tokopedia',
    'form.jobTitlePlaceholder': 'Frontend Engineer',
    'form.locationPlaceholder': 'Jakarta, Indonesia',
    'form.salaryPlaceholder': 'Rp 4.000.000 - 6.000.000 / month',
    'form.recruiterPlaceholder': 'Kevin Tan - recruiter@company.com',
    'form.jobLinkPlaceholder': 'https://company.com/jobs/frontend-engineer',
    'form.notesPlaceholder':
      'Tempel ringkasan pekerjaan, catatan interview, strategi apply, atau reminder di sini.',
    'form.timelineTitlePlaceholder': 'Interview dijadwalkan',
    'form.timelineDescriptionPlaceholder':
      'Tambahkan konteks praktis: siapa yang membalas, apa yang berubah, dan apa langkah berikutnya.',
    'resources.badge': 'Sumber Daya Karier',
    'resources.title':
      'Tips memilih role yang lebih tepat dan menghadapi interview dengan lebih baik',
    'resources.description':
      'Gunakan halaman ini sebagai referensi praktis saat apply. Tujuannya sederhana: apply lebih selektif, persiapan lebih baik, dan keputusan lebih rapi saat recruiter membalas.',
    'resources.jobSearch': 'Pilih pekerjaan dengan sengaja',
    'resources.interview': 'Siapkan jawaban dengan struktur',
    'resources.offer': 'Kelola follow-up dan negosiasi dengan rapi',
    'resources.jobSearchDescription':
      'Fokus ke kejelasan scope, requirement yang realistis, dan sinyal perusahaan yang memengaruhi pertumbuhanmu.',
    'resources.interviewDescription':
      'Sebagian besar interview lebih menghargai kejelasan, relevansi, dan cara berpikir yang tenang daripada terdengar terlalu impresif.',
    'resources.offerDescription':
      'Tetap profesional, ajukan pertanyaan yang presisi, dan nilai offer sebagai paket, bukan gaji saja.',
  },
  en: {
    'common.dashboard': 'Dashboard',
    'common.applications': 'Applications',
    'common.resources': 'Resources',
    'common.overview': 'Overview',
    'common.create': 'Create',
    'common.edit': 'Edit',
    'common.open': 'Open',
    'common.done': 'Done',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.columns': 'Columns',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.update': 'Update',
    'common.language': 'Language',
    'common.theme': 'Theme',
    'common.light': 'Light',
    'common.dark': 'Dark',
    'common.system': 'System',
    'common.private': 'Private',
    'common.platform': 'Platform',
    'common.myTrackerJobs': 'My Tracker Jobs',
    'common.checkingSession': 'Checking session...',
    'sidebar.dashboard': 'Dashboard',
    'sidebar.overview': 'Overview',
    'sidebar.applications': 'Applications',
    'sidebar.resources': 'Resources',
    'auth.badge': 'My Job Tracker',
    'auth.loginTitle': 'Welcome back',
    'auth.registerTitle': 'Create your account',
    'auth.forgotTitle': 'Reset your password',
    'auth.loginDescription':
      'Sign in to your job tracker dashboard with email or Google.',
    'auth.registerDescription':
      'Create a new account to start saving and tracking your job applications.',
    'auth.forgotDescription':
      'Enter your account email and we will send a password reset link.',
    'auth.continueGoogle': 'Continue with Google',
    'auth.orUseEmail': 'or use email',
    'auth.name': 'Name',
    'auth.fullName': 'Full name',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.minPassword': 'Minimum 6 characters',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.sendReset': 'Send reset link',
    'auth.noAccount': "Don't have an account?",
    'auth.haveAccount': 'Already have an account?',
    'auth.rememberPassword': 'Remember your password?',
    'auth.backToLogin': 'Back to login',
    'auth.loginSuccess': 'Login successful.',
    'auth.googleSuccess': 'Google login successful.',
    'auth.registerSuccess': 'Account created successfully.',
    'auth.resetSent': 'Password reset link has been sent to your email.',
    'user.logoutSuccess': 'You have been logged out.',
    'user.logoutFailed': 'Logout failed. Please try again.',
    'user.upgrade': 'Upgrade to Pro',
    'user.account': 'Account',
    'user.billing': 'Billing',
    'user.notifications': 'Notifications',
    'user.logout': 'Log out',
    'dashboard.title': 'Job tracker dashboard',
    'dashboard.description':
      'Keep your applications moving with live reminders, follow-up dates, and one clear next action.',
    'dashboard.openApplications': 'Open applications page',
    'dashboard.nextAction': 'Next Action',
    'dashboard.followUpWith': 'Follow up with {company}',
    'dashboard.dueToday': 'Due today',
    'dashboard.overdue': 'Overdue',
    'dashboard.openFollowUp': 'Open follow-up',
    'dashboard.noFollowUpsTitle': 'No follow-ups due right now',
    'dashboard.noFollowUpsDescription':
      'You do not have any overdue or today follow-up items. Add a follow-up date to an application to see it here.',
    'dashboard.applicationsCount': 'Applications',
    'dashboard.interviewFlow': 'In Interview Flow',
    'dashboard.offers': 'Offers',
    'dashboard.remindersTitle': 'Dashboard reminders',
    'dashboard.remindersDescription':
      'Applications with overdue follow-ups or actions due today.',
    'dashboard.followUpLabel': 'Follow-up',
    'dashboard.noReminders': 'No follow-ups due right now.',
    'applications.title': 'Job applications tracker',
    'applications.description':
      'Monitor every submission, recruiter contact, salary range, and job note from one table.',
    'applications.totalApplications': 'Total Applications',
    'applications.allSubmitted': 'All submitted jobs in tracker',
    'applications.interviewStages': 'Interview Stages',
    'applications.needFollowUp': 'Need follow-up this week',
    'applications.activeNegotiation': 'Active negotiation opportunities',
    'applications.responseRate': 'Response Rate',
    'applications.movedBeyondApplied': 'Moved beyond applied stage',
    'applications.pipeline': 'Pipeline',
    'applications.addApplication': 'Add Application',
    'applications.searchPlaceholder':
      'Search company, role, notes, recruiter...',
    'applications.allStatuses': 'All statuses',
    'applications.allSources': 'All sources',
    'applications.loading': 'Loading applications...',
    'applications.notFound': 'No applications found.',
    'applications.rowsPerPage': 'Rows per page',
    'applications.pageOf': 'Page {current} of {total}',
    'applications.selectedRows':
      '{selected} of {total} application(s) selected.',
    'applications.kanbanTitle': 'Kanban pipeline',
    'applications.kanbanDescription':
      'Drag a card into another column to update its status.',
    'applications.updatingStatus': 'Updating status...',
    'applications.dropHere': 'Drop application here',
    'applications.companyName': 'Company Name',
    'applications.jobTitle': 'Job Title',
    'applications.jobType': 'Job Type',
    'applications.workModel': 'Work Model',
    'applications.location': 'Location',
    'applications.appliedOn': 'Applied On',
    'applications.salary': 'Salary',
    'applications.source': 'Source',
    'applications.followUpDate': 'Follow-up Date',
    'applications.status': 'Status',
    'applications.notes': 'Job Description / Notes',
    'applications.recruiter': 'Recruiter / HR',
    'applications.jobLink': 'Job Link',
    'applications.actions': 'Actions',
    'applications.notSet': 'Not set',
    'applications.openJobPosting': 'Open job posting',
    'applications.activityTimeline': 'Activity Timeline',
    'applications.noActivity': 'No activity logged yet.',
    'applications.editApplication': 'Edit application',
    'applications.deleteConfirmTitle': 'Delete application?',
    'applications.deleteConfirmDescription':
      'This will permanently remove {company} - {title} from your tracker. This action cannot be undone.',
    'applications.deleting': 'Deleting...',
    'applications.deleteSuccess': 'Application deleted successfully.',
    'applications.deleteFailed': 'Failed to delete application.',
    'applications.statusUpdateFailed': 'Failed to update status.',
    'applications.createSuccess': 'Application created successfully.',
    'applications.createFailed': 'Failed to create application.',
    'applications.updateSuccess': 'Application updated successfully.',
    'applications.updateFailed': 'Failed to update application.',
    'applications.notFoundError': 'Application not found.',
    'applications.loadFailed': 'Failed to load application.',
    'form.newTrackerEntry': 'New Tracker Entry',
    'form.createTitle': 'Create application',
    'form.createDescription':
      'Add a new job application with source, salary, recruiter details, and notes so every opportunity stays organized from first apply to final outcome.',
    'form.saveApplication': 'Save Application',
    'form.saving': 'Saving...',
    'form.trackerUpdate': 'Tracker Update',
    'form.editTitle': 'Edit application',
    'form.editDescription':
      'Update the role, recruiter contact, salary range, and notes so your tracker stays current across every hiring stage.',
    'form.updateApplication': 'Update Application',
    'form.updating': 'Updating...',
    'form.applicationDetails': 'Application Details',
    'form.applicationDetailsDescription':
      'Fill the main job information exactly how you want it to appear in the tracker.',
    'form.companyName': 'Company Name',
    'form.jobTitle': 'Job Title',
    'form.jobType': 'Job Type',
    'form.workModel': 'Work Model',
    'form.source': 'Source',
    'form.status': 'Status',
    'form.location': 'Location',
    'form.applicationDate': 'Application Date',
    'form.followUpDate': 'Follow-up Date',
    'form.salary': 'Salary',
    'form.recruiter': 'Recruiter / HR',
    'form.jobLink': 'Job Link',
    'form.notes': 'Job Description / Notes',
    'form.activityTimeline': 'Activity Timeline',
    'form.activityTimelineDescription':
      'Track recruiter replies, interviews, assessments, and follow-up actions in chronological order.',
    'form.addActivity': 'Add Activity',
    'form.activity': 'Activity',
    'form.remove': 'Remove',
    'form.date': 'Date',
    'form.category': 'Category',
    'form.title': 'Title',
    'form.description': 'Description',
    'form.noActivityYet':
      'No activity yet. Add entries for recruiter replies, interviews, assessments, or important follow-up actions.',
    'form.selectJobType': 'Select job type',
    'form.selectWorkModel': 'Select work model',
    'form.selectSource': 'Select source',
    'form.selectStatus': 'Select status',
    'form.selectCategory': 'Select category',
    'form.companyPlaceholder': 'Tokopedia',
    'form.jobTitlePlaceholder': 'Frontend Engineer',
    'form.locationPlaceholder': 'Jakarta, Indonesia',
    'form.salaryPlaceholder': 'Rp 4.000.000 - 6.000.000 / month',
    'form.recruiterPlaceholder': 'Kevin Tan - recruiter@company.com',
    'form.jobLinkPlaceholder': 'https://company.com/jobs/frontend-engineer',
    'form.notesPlaceholder':
      'Paste the job summary, interview notes, application strategy, or reminders here.',
    'form.timelineTitlePlaceholder': 'Interview scheduled',
    'form.timelineDescriptionPlaceholder':
      'Add practical context: who replied, what changed, and what you need to do next.',
    'resources.badge': 'Career Resources',
    'resources.title':
      'Tips to choose better roles and handle interviews well',
    'resources.description':
      'Use this page as a practical reference while applying. The goal is simple: apply more selectively, prepare better, and make cleaner decisions when recruiters reply.',
    'resources.jobSearch': 'Choose jobs intentionally',
    'resources.interview': 'Prepare answers with structure',
    'resources.offer': 'Handle follow-up and negotiation cleanly',
    'resources.jobSearchDescription':
      'Focus on clarity of scope, realistic requirements, and company signals that affect your long-term growth.',
    'resources.interviewDescription':
      'Most interviews reward clarity, relevance, and calm thinking more than trying to sound impressive.',
    'resources.offerDescription':
      'Stay professional, ask precise questions, and evaluate offers as a package instead of salary only.',
  },
} as const

export type TranslationKey = keyof (typeof dictionaries)['en']

export function getDictionary(locale: Locale) {
  return dictionaries[locale]
}

export function tFor(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>,
) {
  const template = String(
    dictionaries[locale][key] ?? dictionaries[defaultLocale][key],
  )

  if (!params) {
    return template
  }

  return Object.entries(params).reduce<string>(
    (result, [paramKey, value]) =>
      result.replaceAll(`{${paramKey}}`, String(value)),
    template,
  )
}

export function normalizeLocale(value: string | undefined | null): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : defaultLocale
}

export function getLocaleDateFormat(locale: Locale) {
  return locale === 'id' ? 'id-ID' : 'en-US'
}

const statusLabels: Record<Locale, Record<JobApplicationStatus, string>> = {
  id: {
    Applied: 'Dilamar',
    Screening: 'Screening',
    Interview: 'Interview',
    Assessment: 'Assessment',
    Offer: 'Offer',
    Rejected: 'Ditolak',
  },
  en: {
    Applied: 'Applied',
    Screening: 'Screening',
    Interview: 'Interview',
    Assessment: 'Assessment',
    Offer: 'Offer',
    Rejected: 'Rejected',
  },
}

const jobTypeLabels: Record<Locale, Record<JobApplicationType, string>> = {
  id: {
    'Full-time': 'Full-time',
    Internship: 'Magang',
    Contract: 'Kontrak',
    Freelance: 'Freelance',
  },
  en: {
    'Full-time': 'Full-time',
    Internship: 'Internship',
    Contract: 'Contract',
    Freelance: 'Freelance',
  },
}

const workModelLabels: Record<Locale, Record<WorkModel, string>> = {
  id: {
    Remote: 'Remote',
    Hybrid: 'Hybrid',
    'On-site': 'On-site',
  },
  en: {
    Remote: 'Remote',
    Hybrid: 'Hybrid',
    'On-site': 'On-site',
  },
}

const sourceLabels: Record<Locale, Record<JobApplicationSource, string>> = {
  id: {
    LinkedIn: 'LinkedIn',
    Glints: 'Glints',
    Jobstreet: 'Jobstreet',
    Referral: 'Referral',
    'Company Website': 'Website Perusahaan',
  },
  en: {
    LinkedIn: 'LinkedIn',
    Glints: 'Glints',
    Jobstreet: 'Jobstreet',
    Referral: 'Referral',
    'Company Website': 'Company Website',
  },
}

const categoryLabels: Record<
  Locale,
  Record<JobApplicationTimelineCategory, string>
> = {
  id: {
    Applied: 'Dilamar',
    'Recruiter Reply': 'Balasan Recruiter',
    Interview: 'Interview',
    Assessment: 'Assessment',
    Offer: 'Offer',
    'Follow-up': 'Follow-up',
    'Status Change': 'Perubahan Status',
    Rejection: 'Penolakan',
  },
  en: {
    Applied: 'Applied',
    'Recruiter Reply': 'Recruiter Reply',
    Interview: 'Interview',
    Assessment: 'Assessment',
    Offer: 'Offer',
    'Follow-up': 'Follow-up',
    'Status Change': 'Status Change',
    Rejection: 'Rejection',
  },
}

export function translateStatus(locale: Locale, value: JobApplicationStatus) {
  return statusLabels[locale][value]
}

export function translateJobType(locale: Locale, value: JobApplicationType) {
  return jobTypeLabels[locale][value]
}

export function translateWorkModel(locale: Locale, value: WorkModel) {
  return workModelLabels[locale][value]
}

export function translateSource(locale: Locale, value: JobApplicationSource) {
  return sourceLabels[locale][value]
}

export function translateTimelineCategory(
  locale: Locale,
  value: JobApplicationTimelineCategory,
) {
  return categoryLabels[locale][value]
}
