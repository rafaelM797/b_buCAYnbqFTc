"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Estudiante, Beca, SolicitudInsert } from "@/lib/types"

interface SolicitudFormProps {
  estudiantes: Estudiante[]
  becas: Beca[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: SolicitudInsert) => Promise<void>
}

export function SolicitudForm({
  estudiantes,
  becas,
  open,
  onOpenChange,
  onSubmit,
}: SolicitudFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<SolicitudInsert>({
    estudiante_id: "",
    beca_id: "",
    comentarios: "",
  })

  useEffect(() => {
    if (open) {
      setFormData({
        estudiante_id: "",
        beca_id: "",
        comentarios: "",
      })
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(formData)
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof SolicitudInsert, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const becasActivas = becas.filter((b) => b.activa && b.cupos_disponibles > 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Solicitud de Beca</DialogTitle>
          <DialogDescription>
            Registra una nueva solicitud de beca para un estudiante
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="estudiante_id">Estudiante *</Label>
            <Select
              value={formData.estudiante_id}
              onValueChange={(value) => handleChange("estudiante_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un estudiante" />
              </SelectTrigger>
              <SelectContent>
                {estudiantes.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No hay estudiantes registrados
                  </SelectItem>
                ) : (
                  estudiantes.map((est) => (
                    <SelectItem key={est.id} value={est.id}>
                      {est.nombre} {est.apellidos} - {est.email}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="beca_id">Beca *</Label>
            <Select
              value={formData.beca_id}
              onValueChange={(value) => handleChange("beca_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una beca" />
              </SelectTrigger>
              <SelectContent>
                {becasActivas.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No hay becas disponibles
                  </SelectItem>
                ) : (
                  becasActivas.map((beca) => (
                    <SelectItem key={beca.id} value={beca.id}>
                      {beca.nombre} - {beca.cupos_disponibles} cupos
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comentarios">Comentarios</Label>
            <Textarea
              id="comentarios"
              value={formData.comentarios || ""}
              onChange={(e) => handleChange("comentarios", e.target.value)}
              rows={3}
              placeholder="Añade notas o comentarios sobre esta solicitud"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.estudiante_id || !formData.beca_id}
            >
              {isLoading ? "Creando..." : "Crear Solicitud"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
