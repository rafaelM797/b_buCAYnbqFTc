"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { BecaForm } from "@/components/forms/beca-form"
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { Beca, BecaInsert } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const tipoLabels: Record<string, string> = {
  academica: "Académica",
  deportiva: "Deportiva",
  necesidad: "Por Necesidad",
  merito: "Por Mérito",
  investigacion: "Investigación",
}

const tipoColors: Record<string, "default" | "secondary" | "outline"> = {
  academica: "default",
  deportiva: "secondary",
  necesidad: "outline",
  merito: "default",
  investigacion: "secondary",
}

export default function BecasPage() {
  const { data, isLoading, mutate } = useSWR<{ data: Beca[] }>("/api/becas", fetcher)
  const [formOpen, setFormOpen] = useState(false)
  const [editingBeca, setEditingBeca] = useState<Beca | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleCreate = async (formData: BecaInsert) => {
    const res = await fetch("/api/becas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (!res.ok) {
      const error = await res.json()
      toast.error(error.error || "Error al crear beca")
      return
    }

    toast.success("Beca creada exitosamente")
    mutate()
  }

  const handleUpdate = async (formData: BecaInsert) => {
    if (!editingBeca) return

    const res = await fetch(`/api/becas/${editingBeca.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (!res.ok) {
      const error = await res.json()
      toast.error(error.error || "Error al actualizar beca")
      return
    }

    toast.success("Beca actualizada exitosamente")
    setEditingBeca(null)
    mutate()
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const res = await fetch(`/api/becas/${deleteId}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      const error = await res.json()
      toast.error(error.error || "Error al eliminar beca")
      return
    }

    toast.success("Beca eliminada exitosamente")
    setDeleteId(null)
    mutate()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const columns = [
    {
      key: "nombre",
      header: "Nombre",
      render: (beca: Beca) => (
        <div>
          <p className="font-medium">{beca.nombre}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">{beca.descripcion}</p>
        </div>
      ),
    },
    {
      key: "tipo",
      header: "Tipo",
      render: (beca: Beca) => (
        <Badge variant={tipoColors[beca.tipo] || "default"}>
          {tipoLabels[beca.tipo] || beca.tipo}
        </Badge>
      ),
    },
    {
      key: "monto",
      header: "Monto",
      render: (beca: Beca) => <span className="font-medium">{formatCurrency(beca.monto)}</span>,
    },
    {
      key: "cupos",
      header: "Cupos",
      render: (beca: Beca) => (
        <span>
          {beca.cupos_disponibles} / {beca.cupos_totales}
        </span>
      ),
    },
    {
      key: "activa",
      header: "Estado",
      render: (beca: Beca) =>
        beca.activa ? (
          <Badge className="bg-success text-success-foreground">Activa</Badge>
        ) : (
          <Badge variant="secondary">Inactiva</Badge>
        ),
    },
    {
      key: "actions",
      header: "Acciones",
      searchable: false,
      render: (beca: Beca) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditingBeca(beca)}
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(beca.id)}
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
          <h1 className="text-3xl font-bold tracking-tight">Becas</h1>
          <p className="text-muted-foreground">Gestiona las becas disponibles en el sistema</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Beca
        </Button>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Buscar beca..."
      />

      <BecaForm open={formOpen} onOpenChange={setFormOpen} onSubmit={handleCreate} />

      <BecaForm
        beca={editingBeca}
        open={!!editingBeca}
        onOpenChange={(open) => !open && setEditingBeca(null)}
        onSubmit={handleUpdate}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Eliminar Beca"
        description="¿Estás seguro de que deseas eliminar esta beca? Esta acción no se puede deshacer y eliminará también todas las solicitudes asociadas."
        onConfirm={handleDelete}
        confirmText="Eliminar"
        variant="destructive"
      />
    </div>
  )
}
