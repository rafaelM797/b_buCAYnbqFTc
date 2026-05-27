"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  LayoutDashboard,
  Users,
  Award,
  Bell,
  Settings,
  LogOut,
  Loader2,
  Shield
} from "lucide-react"

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Usuarios", href: "/admin/usuarios", icon: Users },
  { title: "Becas", href: "/admin/becas", icon: Award },
  { title: "Convocatorias", href: "/admin/convocatorias", icon: Bell },
  { title: "Configuracion", href: "/admin/configuracion", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, logout, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
    if (!isLoading && user && !isAdmin) {
      router.push("/mi-panel")
    }
  }, [user, isLoading, isAdmin, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
              <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <span className="font-semibold">GestorBecas</span>
              <Badge variant="outline" className="ml-2 text-[10px] border-sidebar-border text-sidebar-foreground/60">
                Admin
              </Badge>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
              return (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant={isActive ? "secondary" : "ghost"} 
                    className={`w-full justify-start gap-3 ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* User */}
          <div className="border-t border-sidebar-border p-4 space-y-2">
            <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 px-3 py-2.5 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                <Shield className="h-4 w-4" />
              </div>
              <div className="flex-1 truncate">
                <p className="font-medium text-sidebar-foreground">{user.nombre}</p>
                <p className="text-xs text-sidebar-foreground/60">Super Usuario</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={logout}
              className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/50 bg-background/95 px-4 backdrop-blur md:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">Admin</span>
        </Link>
        <Button variant="outline" size="sm" onClick={logout} className="gap-2">
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      {/* Mobile Nav */}
      <nav className="sticky top-16 z-40 flex items-center justify-around border-b border-border/50 bg-background py-2 md:hidden">
        {navItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`flex-col gap-1 h-auto py-2 ${isActive ? "text-primary" : ""}`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px]">{item.title}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Main */}
      <main className="p-4 md:ml-64 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
