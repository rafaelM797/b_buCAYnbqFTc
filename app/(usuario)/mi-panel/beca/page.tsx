"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  FileText, 
  Download,
  CheckCircle2,
  Clock,
  ArrowLeft
} from "lucide-react"

export default function MiBecaPage() {
  const { user } = useAuth()

  if (!user) return null

  // Calcular progreso de la beca
  const calcularProgreso = () => {
    if (!user.beca) return 0
    const inicio = new Date(user.beca.fecha_inicio).getTime()
    const fin = new Date(user.beca.fecha_fin).getTime()
    const ahora = new Date().getTime()
    const progreso = ((ahora - inicio) / (fin - inicio)) * 100
    return Math.min(Math.max(progreso, 0), 100)
  }

  const historialPagos = [
    { mes: "Septiembre 2024", monto: 350, estado: "pagado", fecha: "2024-09-05" },
    { mes: "Octubre 2024", monto: 350, estado: "pagado", fecha: "2024-10-05" },
    { mes: "Noviembre 2024", monto: 350, estado: "pagado", fecha: "2024-11-05" },
    { mes: "Diciembre 2024", monto: 350, estado: "pagado", fecha: "2024-12-05" },
    { mes: "Enero 2025", monto: 350, estado: "pagado", fecha: "2025-01-05" },
    { mes: "Febrero 2025", monto: 350, estado: "pagado", fecha: "2025-02-05" },
    { mes: "Marzo 2025", monto: 350, estado: "pendiente", fecha: "2025-03-05" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/mi-panel">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Mi Beca</h1>
          <p className="text-muted-foreground">Informacion detallada de tu beca actual</p>
        </div>
      </div>

      {user.beca ? (
        <>
          {/* Beca Principal */}
          <Card className="border-border/50 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-primary p-3">
                    <GraduationCap className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{user.beca.nombre}</h2>
                    <p className="text-muted-foreground capitalize">Tipo: {user.beca.tipo}</p>
                  </div>
                </div>
                <Badge className="self-start bg-green-500/10 text-green-600 border-green-500/20 text-sm py-1 px-3">
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Activa
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-6 space-y-6">
              {/* Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border/50 bg-muted/30 p-4 text-center">
                  <DollarSign className="h-8 w-8 mx-auto text-green-600" />
                  <p className="mt-2 text-2xl font-bold">${user.beca.monto.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Monto Total</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-muted/30 p-4 text-center">
                  <Calendar className="h-8 w-8 mx-auto text-blue-600" />
                  <p className="mt-2 text-2xl font-bold">10</p>
                  <p className="text-sm text-muted-foreground">Meses de Duracion</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-muted/30 p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto text-orange-500" />
                  <p className="mt-2 text-2xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Meses Restantes</p>
                </div>
              </div>

              {/* Progreso */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progreso del periodo</span>
                  <span className="font-medium">{Math.round(calcularProgreso())}%</span>
                </div>
                <Progress value={calcularProgreso()} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{new Date(user.beca.fecha_inicio).toLocaleDateString("es-ES")}</span>
                  <span>{new Date(user.beca.fecha_fin).toLocaleDateString("es-ES")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historial de Pagos */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Historial de Pagos</CardTitle>
                  <CardDescription>Registro de todos los pagos de tu beca</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Descargar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {historialPagos.map((pago, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 p-4"
                  >
                    <div className="flex items-center gap-3">
                      {pago.estado === "pagado" ? (
                        <div className="rounded-full bg-green-500/10 p-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="rounded-full bg-yellow-500/10 p-2">
                          <Clock className="h-4 w-4 text-yellow-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{pago.mes}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(pago.fecha).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${pago.monto}</p>
                      <Badge 
                        variant="outline" 
                        className={pago.estado === "pagado" 
                          ? "bg-green-500/10 text-green-600 border-green-500/20" 
                          : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                        }
                      >
                        {pago.estado === "pagado" ? "Pagado" : "Pendiente"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Documentos */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>Documentos relacionados con tu beca</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { nombre: "Carta de Otorgamiento", fecha: "2024-09-01" },
                  { nombre: "Contrato de Beca", fecha: "2024-09-01" },
                  { nombre: "Comprobante de Pago - Sept", fecha: "2024-09-05" },
                  { nombre: "Comprobante de Pago - Oct", fecha: "2024-10-05" },
                ].map((doc, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{doc.nombre}</p>
                        <p className="text-xs text-muted-foreground">{doc.fecha}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No tienes una beca asignada</h2>
            <p className="mt-2 text-muted-foreground max-w-md">
              Actualmente no cuentas con ninguna beca activa. Revisa las convocatorias disponibles para postularte.
            </p>
            <Link href="/mi-panel/convocatorias" className="mt-6">
              <Button>Ver Convocatorias Disponibles</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
