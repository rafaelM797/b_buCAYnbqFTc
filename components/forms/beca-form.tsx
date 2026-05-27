"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import type { Beca, BecaInsert } from "@/lib/types"

interface BecaFormProps {
  beca?: Beca | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: BecaInsert) => Promise<void>
}

const tiposBeca = [
  { value: "academica", label: "Académica" },
  { value: "deportiva", label: "Deportiva" },
  { value: "necesidad", label: "Por Necesidad" },
  { value: "merito", label: "Por Mérito" },
  { value: "investigacion", label: "Investigación" },
]

export function BecaForm({ beca, open, onOpenChange, onSubmit }: BecaFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<BecaInsert>({
    nombre: "",
    descripcion: "",
    tipo: "academica",
    monto: 0,
    requisitos: "",
    cupos_disponibles: 0,
    cupos_totales: 0,
    fecha_inicio: "",
    fecha_fin: "",
    activa: true,
  })

  useEffect(() => {
    if (beca) {
      setFormData({
        nombre: beca.nombre,
        descripcion: beca.descripcion || "",
        tipo: beca.tipo,
        monto: beca.monto,
        requisitos: beca.requisitos || "",
        cupos_disponibles: beca.cupos_disponibles,
        cupos_totales: beca.cupos_totales,
        fecha_inicio: beca.fecha_inicio,
        fecha_fin: beca.fecha_fin,
        activa: beca.activa,
      })
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        tipo: "academica",
        monto: 0,
        requisitos: "",
        cupos_disponibles: 0,
        cupos_totales: 0,
        fecha_inicio: "",
        fecha_fin: "",
        activa: true,
      })
    }
  }, [beca, open])

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

  const handleChange = (field: keyof BecaInsert, value: string | number | boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === "cupos_totales" && !beca) {
        updated.cupos_disponibles = value as number
      }
      return updated
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{beca ? "Editar Beca" : "Nueva Beca"}</DialogTitle>
          <DialogDescription>
            {beca
              ? "Modifica los datos de la beca"
              : "Completa el formulario para crear una nueva beca"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Beca *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Beca *</Label>
              <Select value={formData.tipo} onValueChange={(value) => handleChange("tipo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposBeca.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="monto">Monto ($) *</Label>
              <Input
                id="monto"
                type="number"
                step="0.01"
                min="0"
                value={formData.monto}
                onChange={(e) => handleChange("monto", parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion || ""}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requisitos">Requisitos</Label>
            <Textarea
              id="requisitos"
              value={formData.requisitos || ""}
              onChange={(e) => handleChange("requisitos", e.target.value)}
              rows={3}
              placeholder="Describe los requisitos para aplicar a esta beca"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cupos_totales">Cupos Totales *</Label>
              <Input
                id="cupos_totales"
                type="number"
                min="1"
                value={formData.cupos_totales}
                onChange={(e) => handleChange("cupos_totales", parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cupos_disponibles">Cupos Disponibles</Label>
              <Input
                id="cupos_disponibles"
                type="number"
                min="0"
                max={formData.cupos_totales}
                value={formData.cupos_disponibles}
                onChange={(e) => handleChange("cupos_disponibles", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => handleChange("fecha_inicio", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_fin">Fecha de Fin *</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => handleChange("fecha_fin", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="activa" className="font-medium">
                Beca Activa
              </Label>
              <p className="text-sm text-muted-foreground">
                Las becas inactivas no aparecerán para nuevas solicitudes
              </p>
            </div>
            <Switch
              id="activa"
              checked={formData.activa}
              onCheckedChange={(checked) => handleChange("activa", checked)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : beca ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
