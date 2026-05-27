"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import type { Estadisticas } from "@/lib/types"

interface ChartsProps {
  stats: Estadisticas | null
  isLoading: boolean
}

const COLORS = {
  pendiente: "hsl(var(--warning))",
  en_revision: "hsl(var(--primary))",
  aprobada: "hsl(var(--success))",
  rechazada: "hsl(var(--destructive))",
}

const NIVEL_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

const ESTADO_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  en_revision: "En Revisión",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
}

const NIVEL_LABELS: Record<string, string> = {
  primaria: "Primaria",
  secundaria: "Secundaria",
  bachillerato: "Bachillerato",
  universidad: "Universidad",
  postgrado: "Postgrado",
}

export function DashboardCharts({ stats, isLoading }: ChartsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-64 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-64 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const solicitudesData = Object.entries(stats?.solicitudesPorEstado || {}).map(
    ([estado, cantidad]) => ({
      name: ESTADO_LABELS[estado] || estado,
      value: cantidad,
      color: COLORS[estado as keyof typeof COLORS] || "hsl(var(--muted))",
    })
  )

  const nivelesData = Object.entries(stats?.estudiantesPorNivel || {}).map(
    ([nivel, cantidad]) => ({
      name: NIVEL_LABELS[nivel] || nivel,
      cantidad,
    })
  )

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes por Estado</CardTitle>
          <CardDescription>Distribución actual de solicitudes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={solicitudesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {solicitudesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estudiantes por Nivel Educativo</CardTitle>
          <CardDescription>Distribución de estudiantes registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nivelesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="cantidad" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
