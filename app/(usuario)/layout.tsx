"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { 
  GraduationCap, 
  Home, 
  FileText, 
  Bell, 
  User, 
  LogOut,
  Loader2 
} from "lucide-react"

const navItems = [
  { title: "Mi Panel", href: "/mi-panel", icon: Home },
  { title: "Mi Beca", href: "/mi-panel/beca", icon: GraduationCap },
  { title: "Convocatorias", href: "/mi-panel/convocatorias", icon: Bell },
  { title: "Mis Datos", href: "/mi-panel/datos", icon: User },
]

export default function UsuarioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
    if (!isLoading && user?.rol === "admin") {
      router.push("/admin")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || user.rol === "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/mi-panel" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">GestorBecas</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right text-sm sm:block">
              <p className="font-medium">{user.nombre} {user.apellidos}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="flex items-center justify-around border-t border-border/50 py-2 md:hidden">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
                <item.icon className="h-5 w-5" />
                <span className="text-[10px]">{item.title}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
