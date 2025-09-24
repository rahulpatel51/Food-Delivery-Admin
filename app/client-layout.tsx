"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Users,
  Store,
  Truck,
  ShoppingCart,
  CreditCard,
  Banknote,
  MessageSquare,
  Settings,
  Tag,
  ImageIcon,
  LogOut,
  User,
  Bell,
  Utensils,
  TrendingUp,
  BarChart3,
  Zap,
  Gift,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

const navigation = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard, color: "text-blue-400" },
      { title: "Analytics", href: "/analytics", icon: BarChart3, color: "text-purple-400" },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Users", href: "/users", icon: Users, color: "text-green-400" },
      { title: "Restaurants", href: "/restaurants", icon: Store, color: "text-orange-400" },
      { title: "Delivery Partners", href: "/delivery-partners", icon: Truck, color: "text-indigo-400" },
      { title: "Orders", href: "/orders", icon: ShoppingCart, color: "text-red-400" },
    ],
  },
  {
    title: "Financial",
    items: [
      { title: "Payments", href: "/payments", icon: CreditCard, color: "text-emerald-400" },
      { title: "Payouts", href: "/payouts", icon: Banknote, color: "text-teal-400" },
    ],
  },
  {
    title: "Marketing",
    items: [
      { title: "Categories", href: "/categories", icon: Tag, color: "text-violet-400" },
      { title: "Banners", href: "/banners", icon: ImageIcon, color: "text-pink-400" },
      { title: "Coupons", href: "/coupons", icon: Gift, color: "text-yellow-400" },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "Contact", href: "/contact", icon: MessageSquare, color: "text-cyan-400" },
      { title: "Notifications", href: "/notifications", icon: Bell, color: "text-rose-400" },
      { title: "Settings", href: "/settings", icon: Settings, color: "text-slate-400" },
    ],
  },
]

function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <Sidebar className="border-r border-slate-800">
      <SidebarHeader className="border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-blue-500 glow-effect">
            <img 
              src="/images/feasto-logo.png" 
              alt="FEASTO Logo"
              className="h-6 w-6 object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              FEASTO ADMIN
            </h2>
            <p className="text-xs text-slate-400">Food Delivery Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-slate-900/50">
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-slate-400 font-medium px-4 py-2">{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      className="mx-2 rounded-lg hover:bg-slate-800/50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-orange-500/20 data-[active=true]:to-red-500/20 data-[active=true]:border data-[active=true]:border-orange-500/30"
                    >
                      <Link href={item.href} className="flex items-center gap-3 px-3 py-2">
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-800 bg-slate-900/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full hover:bg-slate-800/50 rounded-lg mx-2">
                  <Avatar className="h-8 w-8 border-2 border-orange-500/30">
                      <AvatarImage src={user?.avatar || "/images/default-admin.png"} />
                      <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                        {user?.first_name?.[0]}
                        {user?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-white">
                      {user?.first_name || 'Admin'} {user?.last_name}
                    </span>
                    <span className="text-xs text-slate-400">{user?.email || 'admin@feasto.com'}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56 bg-slate-800 border-slate-700">
                <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem asChild className="text-slate-300 hover:bg-slate-700 hover:text-white">
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-slate-300 hover:bg-slate-700 hover:text-white">
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="text-red-400 hover:bg-red-500/20 hover:text-red-300">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState({
    total: 0,
    unread: 0,
    urgent: 0,
  })
  const { user, logout } = useAuth()

  useEffect(() => {
    // Fetch notifications count
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      // Mock API call
      setNotifications({
        total: 47,
        unread: 12,
        urgent: 3,
      })
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-900">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-800 px-4 bg-slate-900/80 backdrop-blur-sm">
          <SidebarTrigger className="-ml-1 text-slate-400 hover:text-white hover:bg-slate-800" />
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-px bg-slate-700"></div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <h1 className="text-lg font-semibold text-white">FEASTO Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative border-slate-700 hover:bg-slate-800">
                    <Bell className="h-4 w-4 text-slate-400" />
                    {notifications.unread > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-orange-500 to-red-500 border-0 flex items-center justify-center">
                        {notifications.unread > 9 ? "9+" : notifications.unread}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-slate-800 border-slate-700">
                  <DropdownMenuLabel className="text-white flex items-center justify-between">
                    Notifications
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                      {notifications.unread} new
                    </Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <div className="max-h-64 overflow-y-auto">
                    <DropdownMenuItem className="text-slate-300 hover:bg-slate-700 p-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New restaurant application</p>
                          <p className="text-xs text-slate-400">Pizza Palace submitted their application</p>
                          <p className="text-xs text-slate-500 mt-1">2 minutes ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-slate-300 hover:bg-slate-700 p-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Payment failed</p>
                          <p className="text-xs text-slate-400">Order #12345 payment processing failed</p>
                          <p className="text-xs text-slate-500 mt-1">5 minutes ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-slate-300 hover:bg-slate-700 p-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New delivery partner</p>
                          <p className="text-xs text-slate-400">John Doe joined as delivery partner</p>
                          <p className="text-xs text-slate-500 mt-1">10 minutes ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem asChild className="text-center text-orange-400 hover:bg-slate-700">
                    <Link href="/notifications" className="w-full">
                      View all notifications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Zap className="h-4 w-4 text-green-400" />
                <span>System Online</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 border-2 border-orange-500/30">
                      <AvatarImage src={user?.avatar || "/images/default-admin.png"} />
                      <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                        {user?.first_name?.[0]}
                        {user?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">
                        {user?.first_name || 'Admin'} {user?.last_name}
                      </p>
                      <p className="text-xs leading-none text-slate-400">{user?.email || 'admin@feasto.com'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem asChild className="text-slate-300 hover:bg-slate-700">
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-slate-300 hover:bg-slate-700">
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem className="text-red-400 hover:bg-red-500/20" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 space-y-4 p-4 md:p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}