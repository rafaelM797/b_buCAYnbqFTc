import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  GraduationCap, 
  Users, 
  FileCheck, 
  TrendingUp,
  Shield,
  Clock,
  BarChart3,
  ArrowRight,
  CheckCircle2
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight">GestorBecas</span>
          </div>
          
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#caracteristicas" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Características
            </a>
            <a href="#estadisticas" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Impacto
            </a>
            <a href="#como-funciona" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Cómo funciona
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="sm" className="gap-2">
                Ingresar <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">
                Sistema integral de gestión de becas
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Administra becas, solicitudes y estudiantes de manera eficiente. Automatiza procesos y toma decisiones basadas en datos en tiempo real.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/login">
                  <Button size="lg" className="gap-2">
                    Acceder al sistema <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <a href="#caracteristicas">
                  <Button size="lg" variant="outline">
                    Conocer más
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="relative h-96 hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur-3xl" />
              <Card className="relative border-primary/20 bg-primary/5">
                <CardContent className="p-8 flex items-center justify-center h-96">
                  <div className="text-center">
                    <BarChart3 className="h-24 w-24 mx-auto text-primary/40 mb-4" />
                    <p className="text-muted-foreground">Panel de análisis en tiempo real</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Características principales</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar becas de manera profesional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Gestión de estudiantes",
                description: "Administra perfiles, documentos y estados de estudiantes"
              },
              {
                icon: FileCheck,
                title: "Solicitudes automatizadas",
                description: "Proceso de solicitud simplificado y verificación rápida"
              },
              {
                icon: BarChart3,
                title: "Reportes y análisis",
                description: "Dashboard con métricas en tiempo real y exportación de datos"
              },
              {
                icon: TrendingUp,
                title: "Estadísticas avanzadas",
                description: "Análisis profundo de becas otorgadas y beneficiarios"
              },
              {
                icon: Shield,
                title: "Seguridad garantizada",
                description: "Autenticación segura y encriptación de datos sensibles"
              },
              {
                icon: Clock,
                title: "Disponible 24/7",
                description: "Sistema confiable con tiempo de actividad garantizado"
              }
            ].map((feature, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="estadisticas" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1000+", label: "Becas gestionadas" },
              { number: "5000+", label: "Estudiantes beneficiados" },
              { number: "99.9%", label: "Disponibilidad del sistema" },
              { number: "24/7", label: "Soporte técnico" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            ¿Listo para transformar tu gestión de becas?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Accede al sistema ahora y comienza a gestionar tus becas de manera eficiente
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="gap-2">
              Iniciar sesión <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold">GestorBecas</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 GestorBecas. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
