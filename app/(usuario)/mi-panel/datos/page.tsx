"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { toast } from "sonner"
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen,
  Building,
  Award,
  ArrowLeft,
  Save
} from "lucide-react"

export default function MisDatosPage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    apellidos: user?.apellidos || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
    institucion: user?.estudiante?.institucion || "",
    carrera: user?.estudiante?.carrera || "",
    promedio: user?.estudiante?.promedio?.toString() || "",
  })

  const handleSave = async () => {
    setIsSaving(true)
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
    toast.success("Datos actualizados correctamente")
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/mi-panel">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Mis Datos</h1>
            <p className="text-muted-foreground">Administra tu informacion personal y academica</p>
          </div>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            Editar Datos
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Datos Personales */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Datos Personales
            </CardTitle>
            <CardDescription>Tu informacion de contacto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input 
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  disabled={!isEditing}
                  className="disabled:opacity-100 disabled:cursor-default"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input 
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
                  disabled={!isEditing}
                  className="disabled:opacity-100 disabled:cursor-default"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Correo Electronico
              </Label>
              <Input 
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="disabled:opacity-100 disabled:cursor-default bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">El correo electronico no puede ser modificado</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Telefono
              </Label>
              <Input 
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                disabled={!isEditing}
                className="disabled:opacity-100 disabled:cursor-default"
              />
            </div>
          </CardContent>
        </Card>

        {/* Datos Academicos */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Datos Academicos
            </CardTitle>
            <CardDescription>Tu informacion educativa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institucion" className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                Institucion
              </Label>
              <Input 
                id="institucion"
                value={formData.institucion}
                onChange={(e) => setFormData(prev => ({ ...prev, institucion: e.target.value }))}
                disabled={!isEditing}
                className="disabled:opacity-100 disabled:cursor-default"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carrera">Carrera / Programa</Label>
              <Input 
                id="carrera"
                value={formData.carrera}
                onChange={(e) => setFormData(prev => ({ ...prev, carrera: e.target.value }))}
                disabled={!isEditing}
                className="disabled:opacity-100 disabled:cursor-default"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promedio" className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                Promedio
              </Label>
              <Input 
                id="promedio"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.promedio}
                onChange={(e) => setFormData(prev => ({ ...prev, promedio: e.target.value }))}
                disabled={!isEditing}
                className="disabled:opacity-100 disabled:cursor-default"
              />
            </div>

            <div className="space-y-2">
              <Label>Nivel Educativo</Label>
              <Input 
                value={user.estudiante?.nivel_educativo || "-"}
                disabled
                className="disabled:opacity-100 disabled:cursor-default bg-muted/50 capitalize"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info de Cuenta */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Informacion de la Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Tipo de cuenta</p>
              <p className="mt-1 font-medium capitalize">{user.rol}</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="mt-1 font-medium text-green-600">Activo</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">ID de Usuario</p>
              <p className="mt-1 font-medium font-mono text-sm">{user.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
