"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { SolicitudForm } from "@/components/forms/solicitud-form"
import { Plus, Trash2, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import type { Estudiante, Beca, SolicitudConRelaciones, EstadoSolicitud } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const estadoConfig: Record<
  EstadoSolicitud,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }
> = {
  pendiente: { label: "Pendiente", variant: "outline", icon: Clock },
  en_revision: { label: "En Revisión", variant: "secondary", icon: Eye },
  aprobada: { label: "Aprobada", variant: "default", icon: CheckCircle },
  rechazada: { label: "Rechazada", variant: "destructive", icon: XCircle },
}

export default function SolicitudesPage() {
  const { data: solicitudesData, isLoading, mutate } = useSWR<{ data: SolicitudConRelaciones[] }>(
    "/api/solicitudes",
    fetcher
  )
  const { data: estudiantesData } = useSWR<{ data: Estudiante[] }>("/api/estudiantes", fetcher)
  const { data: becasData } = useSWR<{ data: Beca[] }>("/api/becas", fetcher)

  const [formOpen, setFormOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filterEstado, setFilterEstado] = useState<string>("todos")

  const handleCreate = async (formData: { estudiante_id: string; beca_id: string; comentarios?: string }) => {
    const res = await fetch("/api/solicitudes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (!res.ok) {
      const error = await res.json()
      toast.error(error.error || "Error al crear solicitud")
      return
    }

    toast.success("Solicitud creada exitosamente")
    mutate()
  }

  const handleEstadoChange = async (id: string, nuevoEstado: EstadoSolicitud) => {
    const res = await fetch(`/api/solicitudes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    })

    if (!res.ok) {
      const error = await res.json()
      toast.error(error.error || "Error al actualizar estado")
      return
    }

    const estadoLabel = estadoConfig[nuevoEstado].label
    toast.success(`Solicitud marcada como "${estadoLabel}"`)
    mutate()
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const res = await fetch(`/api/solicitudes/${deleteId}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      const error = await res.json()
      toast.error(error.error || "Error al eliminar solicitud")
      return
    }

    toast.success("Solicitud eliminada exitosamente")
    setDeleteId(null)
    mutate()
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredSolicitudes =
    filterEstado === "todos"
      ? solicitudesData?.data || []
      : (solicitudesData?.data || []).filter((s) => s.estado === filterEstado)

  const columns = [
    {
      key: "estudiante",
      header: "Estudiante",
      render: (sol: SolicitudConRelaciones) => (
        <div>
          <p className="font-medium">
            {sol.estudiantes?.nombre} {sol.estudiantes?.apellidos}
          </p>
          <p className="text-sm text-muted-foreground">{sol.estudiantes?.email}</p>
        </div>
      ),
    },
    {
      key: "beca",
      header: "Beca",
      render: (sol: SolicitudConRelaciones) => (
        <div>
          <p className="font-medium">{sol.becas?.nombre}</p>
          <p className="text-sm text-muted-foreground">{sol.becas?.tipo}</p>
        </div>
      ),
    },
    {
      key: "fecha_solicitud",
      header: "Fecha",
      render: (sol: SolicitudConRelaciones) => formatDate(sol.fecha_solicitud),
    },
    {
      key: "estado",
      header: "Estado",
      render: (sol: SolicitudConRelaciones) => {
        const config = estadoConfig[sol.estado]
        const Icon = config.icon
        return (
          <Badge variant={config.variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        )
      },
    },
    {
      key: "acciones_estado",
      header: "Cambiar Estado",
      searchable: false,
      render: (sol: SolicitudConRelaciones) => (
        <Select
          value={sol.estado}
          onValueChange={(value) => handleEstadoChange(sol.id, value as EstadoSolicitud)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="en_revision">En Revisión</SelectItem>
            <SelectItem value="aprobada">Aprobada</SelectItem>
            <SelectItem value="rechazada">Rechazada</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "actions",
      header: "",
      searchable: false,
      render: (sol: SolicitudConRelaciones) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleteId(sol.id)}
          title="Eliminar"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solicitudes</h1>
          <p className="text-muted-foreground">Gestiona las solicitudes de becas</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="pendiente">Pendientes</SelectItem>
              <SelectItem value="en_revision">En Revisión</SelectItem>
              <SelectItem value="aprobada">Aprobadas</SelectItem>
              <SelectItem value="rechazada">Rechazadas</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Solicitud
          </Button>
        </div>
      </div>

      <DataTable
        data={filteredSolicitudes}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Buscar solicitud..."
      />

      <SolicitudForm
        estudiantes={estudiantesData?.data || []}
        becas={becasData?.data || []}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Eliminar Solicitud"
        description="¿Estás seguro de que deseas eliminar esta solicitud? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        confirmText="Eliminar"
        variant="destructive"
      />
    </div>
  )
}
