-- Sistema Gestor de Becas y Ayudas Estudiantiles
-- Script de creación de tablas

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabla de estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  fecha_nacimiento DATE,
  direccion TEXT,
  nivel_educativo VARCHAR(50) NOT NULL CHECK (nivel_educativo IN ('primaria', 'secundaria', 'bachillerato', 'universidad', 'postgrado')),
  institucion VARCHAR(200),
  promedio DECIMAL(4,2) CHECK (promedio >= 0 AND promedio <= 10),
  ingreso_familiar DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de becas
CREATE TABLE IF NOT EXISTS becas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('academica', 'deportiva', 'necesidad', 'merito', 'investigacion')),
  monto DECIMAL(12,2) NOT NULL,
  requisitos TEXT,
  cupos_disponibles INTEGER NOT NULL DEFAULT 0,
  cupos_totales INTEGER NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  activa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de solicitudes
CREATE TABLE IF NOT EXISTS solicitudes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudiante_id UUID NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
  beca_id UUID NOT NULL REFERENCES becas(id) ON DELETE CASCADE,
  estado VARCHAR(30) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_revision', 'aprobada', 'rechazada')),
  fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_resolucion TIMESTAMP WITH TIME ZONE,
  comentarios TEXT,
  documentos_adjuntos TEXT[],
  puntuacion INTEGER CHECK (puntuacion >= 0 AND puntuacion <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(estudiante_id, beca_id)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_estudiantes_email ON estudiantes(email);
CREATE INDEX IF NOT EXISTS idx_estudiantes_nivel ON estudiantes(nivel_educativo);
CREATE INDEX IF NOT EXISTS idx_becas_tipo ON becas(tipo);
CREATE INDEX IF NOT EXISTS idx_becas_activa ON becas(activa);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estudiante ON solicitudes(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_beca ON solicitudes(beca_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_estudiantes_updated_at ON estudiantes;
CREATE TRIGGER update_estudiantes_updated_at
  BEFORE UPDATE ON estudiantes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_becas_updated_at ON becas;
CREATE TRIGGER update_becas_updated_at
  BEFORE UPDATE ON becas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_solicitudes_updated_at ON solicitudes;
CREATE TRIGGER update_solicitudes_updated_at
  BEFORE UPDATE ON solicitudes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
