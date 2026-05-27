"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Download,
  LogOut,
  User,
} from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Estudiantes",
    href: "/estudiantes",
    icon: Users,
  },
  {
    title: "Becas",
    href: "/becas",
    icon: GraduationCap,
  },
  {
    title: "Solicitudes",
    href: "/solicitudes",
    icon: FileText,
  },
  {
    title: "Exportar",
    href: "/exportar",
    icon: Download,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 bg-sidebar text-sidebar-foreground md:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <GraduationCap className="mr-3 h-8 w-8 text-sidebar-primary" />
          <div>
            <h1 className="text-lg font-bold">GestorBecas</h1>
            <p className="text-xs text-sidebar-foreground/70">Sistema de Gestión</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4 space-y-2">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 px-3 py-2.5 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 truncate">
              <p className="font-medium text-sidebar-foreground">Administrador</p>
              <p className="text-xs text-sidebar-foreground/60">admin@sistema.com</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesion
          </Link>
        </div>
      </div>
    </aside>
  )
}
