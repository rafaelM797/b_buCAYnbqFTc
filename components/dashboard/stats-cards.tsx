"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, FileText, CheckCircle, Clock, XCircle } from "lucide-react"
import type { Estadisticas } from "@/lib/types"

interface StatsCardsProps {
  stats: Estadisticas | null
  isLoading: boolean
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Estudiantes",
      value: stats?.totales?.estudiantes ?? 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Becas Activas",
      value: stats?.totales?.becasActivas ?? 0,
      icon: GraduationCap,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Total Solicitudes",
      value: stats?.totales?.solicitudes ?? 0,
      icon: FileText,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Aprobadas",
      value: stats?.solicitudesPorEstado?.aprobada ?? 0,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Pendientes",
      value: stats?.solicitudesPorEstado?.pendiente ?? 0,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Rechazadas",
      value: stats?.solicitudesPorEstado?.rechazada ?? 0,
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title} className="group relative overflow-hidden border-border/50 transition-all hover:border-border hover:shadow-md">
          <div className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 ${card.bgColor}`} style={{ opacity: 0.03 }} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-xl p-2.5 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
            ) : (
              <p className="text-3xl font-bold tracking-tight">{card.value.toLocaleString()}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
