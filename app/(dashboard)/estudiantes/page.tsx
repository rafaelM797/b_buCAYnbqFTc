"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { EstudianteForm } from "@/components/forms/estudiante-form"
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { Estudiante, EstudianteInsert } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const nivelLabels: Record<string, string> = {
  primaria: "Primaria",
  secundaria: "Secundaria",
  bachillerato: "Bachillerato",
  universidad: "Universidad",
  postgrado: "Postgrado",
}

export default function EstudiantesPage() {
  const { data, isLoading, mutate } = useSWR<{ data: Estudiante[] }>("/api/estudiantes", fetcher)
  const [formOpen, setFormOpen] = useState(false)
  const [editingEstudiante, setEditingEstudiante] = useState<Estudiante | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleCreate = async (formData: EstudianteInsert) => {
    const res = await fetch("/api/estudiantes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (!res.ok) {
      const error = await res.json()
      toast.error(error.error || "Error al crear estudiante")
      return
    }

    toast.success("Estudiante creado exitosamente")
    mutate()
  }

  const handleUpdate = async (formData: EstudianteInsert) => {
    if (!editingEstudiante) return

    const res = await fetch(`/api/estudiantes/${editingEstudiante.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (!res.ok) {
      const error = await res.json()
      toast.error(error.error || "Error al actualizar estudiante")
      return
    }

    toast.success("Estudiante actualizado exitosamente")
    setEditingEstudiante(null)
    mutate()
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const res = await fetch(`/api/estudiantes/${deleteId}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      const error = await res.json()
      toast.error(error.error || "Error al eliminar estudiante")
      return
    }

    toast.success("Estudiante eliminado exitosamente")
    setDeleteId(null)
    mutate()
  }

  const columns = [
    {
      key: "nombre",
      header: "Nombre",
      render: (est: Estudiante) => (
        <div>
          <p className="font-medium">
            {est.nombre} {est.apellidos}
          </p>
          <p className="text-sm text-muted-foreground">{est.email}</p>
        </div>
      ),
    },
    {
      key: "nivel_educativo",
      header: "Nivel",
      render: (est: Estudiante) => (
        <Badge variant="secondary">{nivelLabels[est.nivel_educativo] || est.nivel_educativo}</Badge>
      ),
    },
    {
      key: "institucion",
      header: "Institución",
      render: (est: Estudiante) => est.institucion || "-",
    },
    {
      key: "promedio",
      header: "Promedio",
      render: (est: Estudiante) => (est.promedio ? est.promedio.toFixed(2) : "-"),
    },
    {
      key: "actions",
      header: "Acciones",
      searchable: false,
      render: (est: Estudiante) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditingEstudiante(est)}
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(est.id)}
            title="Eliminar"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estudiantes</h1>
          <p className="text-muted-foreground">Gestiona los estudiantes registrados en el sistema</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Estudiante
        </Button>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Buscar estudiante..."
      />

      <EstudianteForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
      />

      <EstudianteForm
        estudiante={editingEstudiante}
        open={!!editingEstudiante}
        onOpenChange={(open) => !open && setEditingEstudiante(null)}
        onSubmit={handleUpdate}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Eliminar Estudiante"
        description="¿Estás seguro de que deseas eliminar este estudiante? Esta acción no se puede deshacer y eliminará también todas sus solicitudes asociadas."
        onConfirm={handleDelete}
        confirmText="Eliminar"
        variant="destructive"
      />
    </div>
  )
}
