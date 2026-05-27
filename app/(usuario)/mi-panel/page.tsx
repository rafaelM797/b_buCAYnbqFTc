"use client"

import { useAuth, MOCK_DATA } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  FileText, 
  Bell,
  ArrowRight,
  CheckCircle,
  Clock,
  BookOpen
} from "lucide-react"

export default function MiPanelPage() {
  const { user } = useAuth()

  if (!user) return null

  const estadoBecaBadge = {
    aprobada: { variant: "default" as const, className: "bg-green-500/10 text-green-600 border-green-500/20" },
    pendiente: { variant: "outline" as const, className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    rechazada: { variant: "destructive" as const, className: "" },
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Hola, {user.nombre}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Bienvenido a tu panel de gestion de becas
            </p>
          </div>
          {user.beca && (
            <Badge className={estadoBecaBadge[user.beca.estado as keyof typeof estadoBecaBadge]?.className || ""}>
              <CheckCircle className="mr-1 h-3 w-3" />
              Beca {user.beca.estado}
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mi Beca</CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold truncate">
              {user.beca?.nombre || "Sin beca asignada"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monto</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {user.beca ? `$${user.beca.monto.toLocaleString()}` : "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vigencia</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {user.beca?.fecha_fin ? new Date(user.beca.fecha_fin).toLocaleDateString("es-ES", { month: "short", year: "numeric" }) : "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Convocatorias</CardTitle>
            <Bell className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {MOCK_DATA.convocatorias.filter(c => c.estado === "abierta").length} abiertas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mi Beca Card */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Mi Beca Actual
              </CardTitle>
              <Link href="/mi-panel/beca">
                <Button variant="ghost" size="sm" className="gap-1">
                  Ver detalles <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {user.beca ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{user.beca.nombre}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{user.beca.tipo}</p>
                    </div>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      Activa
                    </Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Monto</p>
                      <p className="font-medium">${user.beca.monto.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Periodo</p>
                      <p className="font-medium">
                        {new Date(user.beca.fecha_inicio).toLocaleDateString("es-ES", { month: "short", year: "numeric" })} - {new Date(user.beca.fecha_fin).toLocaleDateString("es-ES", { month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 rounded-full bg-muted p-3">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No tienes una beca asignada actualmente</p>
                <Link href="/mi-panel/convocatorias" className="mt-4">
                  <Button size="sm">Ver convocatorias disponibles</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Convocatorias Card */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Convocatorias Abiertas
              </CardTitle>
              <Link href="/mi-panel/convocatorias">
                <Button variant="ghost" size="sm" className="gap-1">
                  Ver todas <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_DATA.convocatorias.filter(c => c.estado === "abierta").slice(0, 2).map((conv) => (
                <div key={conv.id} className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{conv.nombre}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Cierra: {new Date(conv.fecha_fin).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 bg-green-500/10 text-green-600 border-green-500/20">
                      ${conv.monto.toLocaleString()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Datos Academicos */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Mis Datos Academicos
              </CardTitle>
              <Link href="/mi-panel/datos">
                <Button variant="ghost" size="sm" className="gap-1">
                  Editar <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {user.estudiante ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">Institucion</p>
                  <p className="mt-1 font-medium">{user.estudiante.institucion}</p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">Carrera</p>
                  <p className="mt-1 font-medium">{user.estudiante.carrera}</p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">Nivel Educativo</p>
                  <p className="mt-1 font-medium capitalize">{user.estudiante.nivel_educativo}</p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">Promedio</p>
                  <p className="mt-1 font-medium">{user.estudiante.promedio.toFixed(1)}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No hay datos academicos registrados</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
