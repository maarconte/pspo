"use client"

import { type LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type NavMainProps = {
  group?: string
  items?: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
  }[]
}

export function NavMain({ group, items }: NavMainProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <SidebarGroup>
      {group && <SidebarGroupLabel>{group}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
              <Link to={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
