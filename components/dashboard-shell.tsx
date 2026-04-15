'use client'

import * as React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { AuthGuard } from '@/components/auth-guard'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

const SIDEBAR_STORAGE_KEY = 'job-tracker-sidebar-open'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)

  React.useEffect(() => {
    const storedValue = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)

    if (storedValue !== null) {
      setIsSidebarOpen(storedValue === 'true')
    }
  }, [])

  const handleSidebarOpenChange = React.useCallback((open: boolean) => {
    setIsSidebarOpen(open)
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open))
  }, [])

  return (
    <AuthGuard>
      <SidebarProvider open={isSidebarOpen} onOpenChange={handleSidebarOpenChange}>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
