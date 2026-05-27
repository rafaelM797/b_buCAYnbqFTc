"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Download, Users, GraduationCap, FileText } from "lucide-react"

type TipoExport = "estudiantes" | "becas" | "solicitudes"

const exportOptions: { value: TipoExport; label: string; icon: React.ElementType; description: string }[] = [
  {
    value: "estudiantes",
    label: "Estudiantes",
    icon: Users,
    description: "Exporta todos los estudiantes registrados con sus datos personales y académicos",
  },
  {
    value: "becas",
    label: "Becas",
    icon: GraduationCap,
    description: "Exporta todas las becas con información de cupos, montos y requisitos",
  },
  {
    value: "solicitudes",
    label: "Solicitudes",
    icon: FileText,
    description: "Exporta todas las solicitudes con el estado actual y datos del estudiante y beca",
  },
]

export default function ExportarPage() {
  const [selectedType, setSelectedType] = useState<TipoExport>("estudiantes")
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/exportar?tipo=${selectedType}`)

      if (!res.ok) {
        const error = await res.json()
        toast.error(error.error || "Error al exportar datos")
        return
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${selectedType}_${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Archivo exportado exitosamente")
    } catch {
      toast.error("Error al descargar el archivo")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exportar Datos</h1>
        <p className="text-muted-foreground">Descarga los datos del sistema en formato CSV</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Seleccionar Datos</CardTitle>
            <CardDescription>
              Elige qué tipo de datos deseas exportar del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de datos</Label>
              <Select value={selectedType} onValueChange={(v) => setSelectedType(v as TipoExport)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exportOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleExport} disabled={isLoading} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              {isLoading ? "Exportando..." : "Descargar CSV"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {exportOptions.map((opt) => {
            const Icon = opt.icon
            const isSelected = selectedType === opt.value
            return (
              <Card
                key={opt.value}
                className={`cursor-pointer transition-colors ${
                  isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedType(opt.value)}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  <div
                    className={`rounded-lg p-2 ${
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{opt.label}</h3>
                    <p className="text-sm text-muted-foreground">{opt.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
