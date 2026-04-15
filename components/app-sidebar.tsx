"use client"

import * as React from "react"
import { usePathname } from 'next/navigation'
import {
  AudioWaveform,
  BookOpen,
  BriefcaseBusiness,
  Command,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  PieChart,
  Settings2,
  Target,
} from "lucide-react"

import { useAuth } from '@/components/auth-provider'
import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
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
        {
          title: "Auth Pages",
          url: "/login",
        },
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
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} pathname={pathname} />
        {/* <NavProjects projects={data.projects} pathname={pathname} /> */}
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
