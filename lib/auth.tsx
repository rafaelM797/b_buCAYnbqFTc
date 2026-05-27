"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

// Usuarios hardcodeados
const USERS = {
  "rafa@outlook.com": {
    id: "1",
    email: "rafa@outlook.com",
    password: "123456",
    nombre: "Rafael",
    apellidos: "Garcia Martinez",
    rol: "admin" as const,
    telefono: "+34 612 345 678",
  },
  "afa@outlook.com": {
    id: "2", 
    email: "afa@outlook.com",
    password: "123456",
    nombre: "Alfonso",
    apellidos: "Rodriguez Lopez",
    rol: "usuario" as const,
    telefono: "+34 698 765 432",
    estudiante: {
      id: "est-001",
      nivel_educativo: "universidad",
      institucion: "Universidad Complutense de Madrid",
      promedio: 8.5,
      carrera: "Ingenieria Informatica",
    },
    beca: {
      id: "beca-001",
      nombre: "Beca de Excelencia Academica",
      tipo: "academica",
      monto: 3500,
      estado: "aprobada",
      fecha_inicio: "2024-09-01",
      fecha_fin: "2025-06-30",
    }
  }
}

export type UserRole = "admin" | "usuario"

export interface User {
  id: string
  email: string
  nombre: string
  apellidos: string
  rol: UserRole
  telefono?: string
  estudiante?: {
    id: string
    nivel_educativo: string
    institucion: string
    promedio: number
    carrera: string
  }
  beca?: {
    id: string
    nombre: string
    tipo: string
    monto: number
    estado: string
    fecha_inicio: string
    fecha_fin: string
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar sesión guardada
    const savedUser = localStorage.getItem("becas_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem("becas_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const userRecord = USERS[email as keyof typeof USERS]
    
    if (!userRecord) {
      return { success: false, error: "Usuario no encontrado" }
    }
    
    if (userRecord.password !== password) {
      return { success: false, error: "Contrasena incorrecta" }
    }

    const { password: _, ...userWithoutPassword } = userRecord
    setUser(userWithoutPassword as User)
    localStorage.setItem("becas_user", JSON.stringify(userWithoutPassword))
    
    // Redirigir según rol
    if (userRecord.rol === "admin") {
      router.push("/admin")
    } else {
      router.push("/mi-panel")
    }
    
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("becas_user")
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout,
      isAdmin: user?.rol === "admin"
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}

// Datos mock para el sistema
export const MOCK_DATA = {
  convocatorias: [
    {
      id: "conv-001",
      nombre: "Beca de Excelencia Academica 2025",
      tipo: "academica",
      monto: 4000,
      fecha_inicio: "2025-03-01",
      fecha_fin: "2025-04-30",
      requisitos: "Promedio minimo de 8.0, estar matriculado en universidad publica",
      cupos: 50,
      estado: "abierta"
    },
    {
      id: "conv-002", 
      nombre: "Ayuda al Transporte Escolar",
      tipo: "necesidad",
      monto: 800,
      fecha_inicio: "2025-02-15",
      fecha_fin: "2025-03-15",
      requisitos: "Distancia mayor a 20km del centro educativo",
      cupos: 200,
      estado: "abierta"
    },
    {
      id: "conv-003",
      nombre: "Beca Deportiva de Alto Rendimiento",
      tipo: "deportiva", 
      monto: 5000,
      fecha_inicio: "2025-05-01",
      fecha_fin: "2025-06-30",
      requisitos: "Formar parte de seleccion nacional o regional",
      cupos: 25,
      estado: "proxima"
    }
  ],
  usuariosAdmin: [
    {
      id: "2",
      email: "afa@outlook.com",
      nombre: "Alfonso",
      apellidos: "Rodriguez Lopez",
      estado: "activo",
      beca: "Beca de Excelencia Academica",
      fecha_registro: "2024-01-15"
    },
    {
      id: "3",
      email: "maria@email.com",
      nombre: "Maria",
      apellidos: "Fernandez Ruiz",
      estado: "pendiente",
      beca: "Ayuda al Transporte",
      fecha_registro: "2024-02-20"
    },
    {
      id: "4",
      email: "carlos@email.com",
      nombre: "Carlos",
      apellidos: "Sanchez Gomez",
      estado: "activo",
      beca: "Beca Deportiva",
      fecha_registro: "2024-01-10"
    },
    {
      id: "5",
      email: "laura@email.com",
      nombre: "Laura",
      apellidos: "Martinez Diaz",
      estado: "baja",
      beca: "Beca de Excelencia",
      fecha_registro: "2023-09-01",
      fecha_baja: "2024-06-15",
      motivo_baja: "Finalizacion de estudios"
    },
    {
      id: "6",
      email: "pedro@email.com",
      nombre: "Pedro",
      apellidos: "Lopez Hernandez",
      estado: "pendiente",
      beca: "Beca de Investigacion",
      fecha_registro: "2024-03-01"
    }
  ],
  becasOtorgadas: [
    { tipo: "academica", nombre: "Beca de Excelencia", cantidad: 45, monto_total: 157500 },
    { tipo: "deportiva", nombre: "Beca Deportiva", cantidad: 12, monto_total: 60000 },
    { tipo: "necesidad", nombre: "Ayuda Economica", cantidad: 78, monto_total: 62400 },
    { tipo: "investigacion", nombre: "Beca de Investigacion", cantidad: 8, monto_total: 48000 },
  ]
}
