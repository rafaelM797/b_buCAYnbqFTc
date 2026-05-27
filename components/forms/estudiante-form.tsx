"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import type { Estudiante, EstudianteInsert } from "@/lib/types"

interface EstudianteFormProps {
  estudiante?: Estudiante | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EstudianteInsert) => Promise<void>
}

const nivelesEducativos = [
  { value: "primaria", label: "Primaria" },
  { value: "secundaria", label: "Secundaria" },
  { value: "bachillerato", label: "Bachillerato" },
  { value: "universidad", label: "Universidad" },
  { value: "postgrado", label: "Postgrado" },
]

const getInitialFormData = (estudiante?: Estudiante | null): EstudianteInsert => ({
  nombre: estudiante?.nombre || "",
  apellidos: estudiante?.apellidos || "",
  email: estudiante?.email || "",
  telefono: estudiante?.telefono || "",
  fecha_nacimiento: estudiante?.fecha_nacimiento || "",
  direccion: estudiante?.direccion || "",
  nivel_educativo: estudiante?.nivel_educativo || "universidad",
  institucion: estudiante?.institucion || "",
  promedio: estudiante?.promedio ?? null,
  ingreso_familiar: estudiante?.ingreso_familiar ?? null,
})

export function EstudianteForm({ estudiante, open, onOpenChange, onSubmit }: EstudianteFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<EstudianteInsert>(getInitialFormData(estudiante))

  // Resetear formulario cuando cambia el estudiante o se abre/cierra
  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(estudiante))
    }
  }, [open, estudiante])

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

  const handleChange = (field: keyof EstudianteInsert, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{estudiante ? "Editar Estudiante" : "Nuevo Estudiante"}</DialogTitle>
          <DialogDescription>
            {estudiante
              ? "Modifica los datos del estudiante"
              : "Completa el formulario para registrar un nuevo estudiante"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellidos">Apellidos *</Label>
              <Input
                id="apellidos"
                value={formData.apellidos}
                onChange={(e) => handleChange("apellidos", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono || ""}
                onChange={(e) => handleChange("telefono", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
              <Input
                id="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento || ""}
                onChange={(e) => handleChange("fecha_nacimiento", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nivel_educativo">Nivel Educativo *</Label>
              <Select
                value={formData.nivel_educativo}
                onValueChange={(value) => handleChange("nivel_educativo", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona nivel" />
                </SelectTrigger>
                <SelectContent>
                  {nivelesEducativos.map((nivel) => (
                    <SelectItem key={nivel.value} value={nivel.value}>
                      {nivel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="institucion">Institución</Label>
            <Input
              id="institucion"
              value={formData.institucion || ""}
              onChange={(e) => handleChange("institucion", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="promedio">Promedio (0-10)</Label>
              <Input
                id="promedio"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.promedio || ""}
                onChange={(e) =>
                  handleChange("promedio", e.target.value ? parseFloat(e.target.value) : null)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ingreso_familiar">Ingreso Familiar Mensual</Label>
              <Input
                id="ingreso_familiar"
                type="number"
                step="0.01"
                min="0"
                value={formData.ingreso_familiar || ""}
                onChange={(e) =>
                  handleChange(
                    "ingreso_familiar",
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Textarea
              id="direccion"
              value={formData.direccion || ""}
              onChange={(e) => handleChange("direccion", e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : estudiante ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
