"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SolicitudConRelaciones } from "@/lib/types"

interface RecentApplicationsProps {
  solicitudes: SolicitudConRelaciones[]
  isLoading: boolean
}

const estadoStyles: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
  pendiente: { variant: "outline", label: "Pendiente" },
  en_revision: { variant: "secondary", label: "En Revisión" },
  aprobada: { variant: "default", label: "Aprobada" },
  rechazada: { variant: "destructive", label: "Rechazada" },
}

export function RecentApplications({ solicitudes, isLoading }: RecentApplicationsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Recientes</CardTitle>
          <CardDescription>Últimas solicitudes registradas en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-48 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-6 w-20 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitudes Recientes</CardTitle>
        <CardDescription>Últimas solicitudes registradas en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        {solicitudes.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No hay solicitudes registradas aún
          </p>
        ) : (
          <div className="space-y-4">
            {solicitudes.map((solicitud) => {
              const style = estadoStyles[solicitud.estado] || estadoStyles.pendiente
              return (
                <div
                  key={solicitud.id}
                  className="flex items-center gap-4 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {solicitud.estudiantes?.nombre?.charAt(0) || "?"}
                    {solicitud.estudiantes?.apellidos?.charAt(0) || ""}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">
                      {solicitud.estudiantes?.nombre} {solicitud.estudiantes?.apellidos}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {solicitud.becas?.nombre}
                    </p>
                  </div>
                  <Badge variant={style.variant}>{style.label}</Badge>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
