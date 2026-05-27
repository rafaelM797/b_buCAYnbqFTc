"use client"

import { useState } from "react"
import { MOCK_DATA } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { 
  Bell, 
  Calendar, 
  DollarSign, 
  Users,
  Search,
  ArrowLeft,
  Clock,
  CheckCircle,
  ArrowRight
} from "lucide-react"

export default function ConvocatoriasPage() {
  const [busqueda, setBusqueda] = useState("")

  const convocatoriasFiltradas = MOCK_DATA.convocatorias.filter(conv =>
    conv.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    conv.tipo.toLowerCase().includes(busqueda.toLowerCase())
  )

  const estadoBadge = {
    abierta: { className: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle },
    proxima: { className: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Clock },
    cerrada: { className: "bg-gray-500/10 text-gray-600 border-gray-500/20", icon: Clock },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/mi-panel">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Convocatorias</h1>
          <p className="text-muted-foreground">Explora las becas y ayudas disponibles</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Buscar convocatorias..." 
            className="pl-9"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <Badge variant="outline" className="hidden sm:flex">
          {convocatoriasFiltradas.length} convocatorias
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-green-500/10 p-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{MOCK_DATA.convocatorias.filter(c => c.estado === "abierta").length}</p>
              <p className="text-sm text-muted-foreground">Abiertas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{MOCK_DATA.convocatorias.filter(c => c.estado === "proxima").length}</p>
              <p className="text-sm text-muted-foreground">Proximas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                ${MOCK_DATA.convocatorias.reduce((acc, c) => acc + c.monto, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Monto Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Convocatorias */}
      <div className="space-y-4">
        {convocatoriasFiltradas.map((conv) => {
          const estado = estadoBadge[conv.estado as keyof typeof estadoBadge]
          const EstadoIcon = estado?.icon || Clock

          return (
            <Card key={conv.id} className="border-border/50 overflow-hidden transition-all hover:shadow-md">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Info Principal */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={estado?.className}>
                            <EstadoIcon className="mr-1 h-3 w-3" />
                            {conv.estado === "abierta" ? "Abierta" : conv.estado === "proxima" ? "Proxima" : "Cerrada"}
                          </Badge>
                          <Badge variant="outline" className="capitalize">{conv.tipo}</Badge>
                        </div>
                        <h3 className="text-lg font-semibold">{conv.nombre}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">${conv.monto.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Monto</p>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground">{conv.requisitos}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(conv.fecha_inicio).toLocaleDateString("es-ES")} - {new Date(conv.fecha_fin).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{conv.cupos} cupos disponibles</span>
                      </div>
                    </div>
                  </div>

                  {/* Accion */}
                  <div className="flex items-center justify-end border-t lg:border-l lg:border-t-0 border-border/50 bg-muted/20 p-4 lg:p-6">
                    <Button 
                      className="w-full lg:w-auto gap-2"
                      disabled={conv.estado !== "abierta"}
                    >
                      {conv.estado === "abierta" ? (
                        <>
                          Postularme <ArrowRight className="h-4 w-4" />
                        </>
                      ) : (
                        "No disponible"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {convocatoriasFiltradas.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No se encontraron convocatorias</h3>
            <p className="mt-2 text-muted-foreground">Intenta con otros terminos de busqueda</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
