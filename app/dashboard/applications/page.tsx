import { cookies } from 'next/headers'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { JobApplicationsTable } from '@/components/job-applications-table'
import { defaultLocale, localeCookieName, normalizeLocale, tFor } from '@/lib/i18n'

export default async function ApplicationsPage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(localeCookieName)?.value ?? defaultLocale,
  )

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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  {tFor(locale, 'common.dashboard')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{tFor(locale, 'common.applications')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="@container/main flex flex-1 flex-col gap-6 py-6">
        <JobApplicationsTable />
      </main>
    </>
  )
}
