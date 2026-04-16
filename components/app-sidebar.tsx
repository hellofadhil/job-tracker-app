"use client"

import * as React from "react"
import { usePathname } from 'next/navigation'
import {
  BriefcaseBusiness,
  LayoutDashboard,
} from "lucide-react"

import { useAuth } from '@/components/auth-provider'
import { LanguageToggle } from '@/components/language-toggle'
import { useI18n } from '@/components/locale-provider'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user } = useAuth()
  const { t } = useI18n()

  if (!user) {
    return null
  }

  const data = {
    navMain: [
      {
        title: t('sidebar.dashboard'),
        url: '/dashboard',
        icon: LayoutDashboard,
        isActive: true,
        items: [
          {
            title: t('sidebar.overview'),
            url: '/dashboard',
          },
          {
            title: t('sidebar.applications'),
            url: '/dashboard/applications',
          },
          {
            title: t('sidebar.resources'),
            url: '/dashboard/resources',
          },
        ],
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" className="dark:bg-[#121212]" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="pointer-events-none opacity-100 hover:bg-transparent active:bg-transparent"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <BriefcaseBusiness className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {t('common.myTrackerJobs')}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {t('common.private')}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain}
          pathname={pathname}
          groupLabel={t('common.platform')}
        />
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
        <LanguageToggle />
        <NavUser
          user={{
            name: user.displayName || 'Job Tracker User',
            email: user.email || 'No email',
            avatar: user.photoURL || '',
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
