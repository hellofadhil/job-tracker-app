"use client"

import * as React from "react"
import { usePathname } from 'next/navigation'
import {
  BriefcaseBusiness,
  LayoutDashboard,
} from "lucide-react"

import { useAuth } from '@/components/auth-provider'
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

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Applications",
          url: "/dashboard/applications",
        },
        // {
        //   title: "Auth Pages",
        //   url: "/login",
        // },
      ],
    },
    // {
    //   title: "Pipeline",
    //   url: "/dashboard/applications",
    //   icon: Target,
    //   items: [
    //     {
    //       title: "Applied",
    //       url: "/dashboard/applications",
    //     },
    //     {
    //       title: "Interview",
    //       url: "/dashboard/applications",
    //     },
    //     {
    //       title: "Offer",
    //       url: "/dashboard/applications",
    //     },
    //   ],
    // },
    // {
    //   title: "Resources",
    //   url: "/dashboard/applications",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "LinkedIn leads",
    //       url: "/dashboard/applications",
    //     },
    //     {
    //       title: "Glints shortlist",
    //       url: "/dashboard/applications",
    //     },
    //     {
    //       title: "Referrals",
    //       url: "/dashboard/applications",
    //     },
    //     {
    //       title: "Career notes",
    //       url: "/dashboard/applications",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "/dashboard",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "/dashboard",
    //     },
    //     {
    //       title: "Account",
    //       url: "/dashboard",
    //     },
    //     {
    //       title: "Billing",
    //       url: "/dashboard",
    //     },
    //     {
    //       title: "Limits",
    //       url: "/dashboard",
    //     },
    //   ],
    // },
  ],
  // projects: [
  //   {
  //     name: "Frontend Roles",
  //     url: "/dashboard/applications",
  //     icon: BriefcaseBusiness,
  //   },
  //   {
  //     name: "Internships",
  //     url: "/dashboard/applications",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Referral Leads",
  //     url: "/dashboard/applications",
  //     icon: Map,
  //   },
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) {
    return null
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
                <span className="truncate font-medium">My Tracker Jobs</span>
                <span className="truncate text-xs text-muted-foreground">
                  Private
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} pathname={pathname} />
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
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
