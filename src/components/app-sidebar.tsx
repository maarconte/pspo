"use client"

import { useLocation } from "react-router-dom"
import { FileEdit, Users, LayoutDashboard, Plus } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUserStore } from "@/stores/useUserStore"
import { useUserRole } from "@/features/auth/hooks/useUserRole"

// Menu items configuration with role-based access
const menuItems = [
    {
    title: "My Sessions",
    url: "/sessions",
    icon: LayoutDashboard,
    requiresAuth: true,
    group: "Sessions",
  },
  {
    title: "Create Session",
    url: "/sessions/create",
    icon: Plus,
    requiresAuth: true,
    group: "Sessions",
  },
  {
    title: "Questions",
    url: "/admin/edit-questions",
    icon: FileEdit,
    requiresRole: "admin" as const,
    group: "Admin",
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    requiresRole: "dev" as const,
    group: "Admin",
  }]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const { user } = useUserStore()
  const { isAdmin, isDev } = useUserRole()

  // Don't render sidebar if user is not authenticated
  if (!user) {
    return null
  }

  // Filter menu items based on user role
  const filteredItems = menuItems.filter((item) => {
    if (item.requiresRole === "admin") return isAdmin
    if (item.requiresRole === "dev") return isDev
    if (item.requiresAuth) return !!user
    return true
  })

  // Group items by their group property
  const groupedItems = filteredItems.reduce((acc, item) => {
    const group = item.group || "Other"
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group].push({
      title: item.title,
      url: item.url,
      icon: item.icon,
      isActive: location.pathname === item.url,
    })
    return acc
  }, {} as Record<string, Array<{ title: string; url: string; icon: any; isActive: boolean }>>)

  // Sample user data for NavUser component
  const userData = {
    name: user.displayName || "User",
    email: user.email || "",
    avatar: user.photoURL || "",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        {Object.entries(groupedItems).map(([group, items]) => (
          <NavMain key={group} group={group} items={items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
