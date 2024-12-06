import { Home, Printer, Settings, FileBarChart, MessageSquareMore, History } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { paths } from "@/utils/path"
import { Link } from "react-router-dom"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"

// Menu items.
const items = [
  {
    title: "Trang chủ",
    url: paths.Admin,
    icon: Home,
  },
  {
    title: "Lịch sử in",
    url: paths.AdminHistory,
    icon: History,
  },
  {
    title: "Quản lý máy in",
    url: paths.Printer,
    icon: Printer,
  },
  {
    title: "Báo cáo",
    url: paths.Report,
    icon: FileBarChart,
  },
  {
    title: "Cài đặt",
    url: paths.Settings,
    icon: Settings,
  },
]

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="pb-5 pt-9 space-y-2">
            <h2>BKPS</h2>
            <Badge className="rounded-full ml-2">SPSO</Badge>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-10">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      className={cn(window.location.pathname === item.url ? 'text-primary border-2 border-primary/50 hover:text-primary' : 'hover:bg-gray-200', 'flex items-center gap-4 p-3 rounded-md')}
                      to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
