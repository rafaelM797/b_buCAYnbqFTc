"use client"

import useSWR from "swr"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { DashboardCharts } from "@/components/dashboard/charts"
import { RecentApplications } from "@/components/dashboard/recent-applications"
import { Plus, Users, GraduationCap, FileText } from "lucide-react"
import type { Estadisticas, SolicitudConRelaciones } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useSWR<Estadisticas>(
    "/api/estadisticas",
    fetcher
  )

  const { data: solicitudesData, isLoading: solicitudesLoading } = useSWR<{
    data: SolicitudConRelaciones[]
  }>("/api/solicitudes?limit=5", fetcher)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Bienvenido al Sistema de Gestion de Becas y Ayudas
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Link href="/estudiantes">
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Ver</span> Estudiantes
            </Button>
          </Link>
          <Link href="/becas">
            <Button variant="outline" size="sm" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Ver</span> Becas
            </Button>
          </Link>
          <Link href="/solicitudes">
            <Button size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Ver</span> Solicitudes
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats || null} isLoading={statsLoading} />

      {/* Charts */}
      <DashboardCharts stats={stats || null} isLoading={statsLoading} />

      {/* Recent Applications */}
      <RecentApplications
        solicitudes={solicitudesData?.data || []}
        isLoading={solicitudesLoading}
      />
    </div>
  )
}
