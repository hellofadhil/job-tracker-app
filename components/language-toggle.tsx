'use client'

import { Languages } from 'lucide-react'
import { useI18n } from '@/components/locale-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n()
  const { state } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton tooltip={t('common.language')}>
              <Languages className="size-4" />
              {state !== 'collapsed' && (
                <span>
                  {t('common.language')} · {locale.toUpperCase()}
                </span>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setLocale('id')}>
              Indonesia
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocale('en')}>
              English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
