// Tipos para el Sistema Gestor de Becas

export type NivelEducativo = 'primaria' | 'secundaria' | 'bachillerato' | 'universidad' | 'postgrado'
export type TipoBeca = 'academica' | 'deportiva' | 'necesidad' | 'merito' | 'investigacion'
export type EstadoSolicitud = 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada'

export interface Estudiante {
  id: string
  nombre: string
  apellidos: string
  email: string
  telefono?: string
  fecha_nacimiento?: string
  direccion?: string
  nivel_educativo: NivelEducativo
  institucion?: string
  promedio?: number
  ingreso_familiar?: number
  created_at: string
  updated_at: string
}

export interface Beca {
  id: string
  nombre: string
  descripcion?: string
  tipo: TipoBeca
  monto: number
  requisitos?: string
  cupos_disponibles: number
  cupos_totales: number
  fecha_inicio: string
  fecha_fin: string
  activa: boolean
  created_at: string
  updated_at: string
}

export interface Solicitud {
  id: string
  estudiante_id: string
  beca_id: string
  estado: EstadoSolicitud
  fecha_solicitud: string
  fecha_resolucion?: string
  comentarios?: string
  documentos_adjuntos?: string[]
  puntuacion?: number
  created_at: string
  updated_at: string
  // Relaciones
  estudiante?: Estudiante
  beca?: Beca
}

// Tipos para formularios (alias para compatibilidad)
export type EstudianteInput = Omit<Estudiante, 'id' | 'created_at' | 'updated_at'>
export type EstudianteInsert = EstudianteInput
export type BecaInput = Omit<Beca, 'id' | 'created_at' | 'updated_at'>
export type BecaInsert = BecaInput
export type SolicitudInput = Omit<Solicitud, 'id' | 'created_at' | 'updated_at' | 'estudiante' | 'beca'>
export type SolicitudInsert = SolicitudInput

// Solicitud con relaciones
export interface SolicitudConRelaciones extends Solicitud {
  estudiantes?: Estudiante
  becas?: Beca
}

// Estadísticas del Dashboard (formato de respuesta de API)
export interface Estadisticas {
  totales: {
    estudiantes: number
    becas: number
    solicitudes: number
    becasActivas: number
    montoTotalAprobado: number
  }
  solicitudesPorEstado: Record<EstadoSolicitud, number>
  solicitudesPorTipo: Record<TipoBeca, number>
  estudiantesPorNivel: Record<NivelEducativo, number>
}

// Alias para compatibilidad
export type DashboardStats = Estadisticas
