# 🎓 Sistema de Gestión de Becas y Ayudas

## 📋 Descripción General

Sistema completo de gestión de becas y ayudas financieras para estudiantes. Permite la administración integral de becas, solicitudes de estudiantes, evaluación de solicitudes y generación de reportes.

**Stack Tecnológico:**
- **Frontend:** Next.js 16.1.6 + TypeScript + Tailwind CSS + SWR
- **Backend:** FastAPI + Python + SQLAlchemy + PostgreSQL
- **Base de Datos:** PostgreSQL 15 con persistencia en Docker
- **Orquestación:** Docker Compose
- **Análisis de Código:** SonarQube

---

## 🚀 Características Principales

✅ **Autenticación segura** con bcrypt  
✅ **Dashboard en tiempo real** con actualización automática cada 10 segundos  
✅ **Gestión de estudiantes** con búsqueda y filtros  
✅ **Gestión de becas** por tipo (académica, deportiva, necesidad, etc.)  
✅ **Sistema de solicitudes** con estados y puntuaciones  
✅ **Exportación de datos** a reportes  
✅ **Panel administrativo** con estadísticas completas  
✅ **API REST documentada** con Swagger

---

## 📦 Requisitos Previos

- **Docker & Docker Compose** (versión 20.10 o superior)
- **Windows 10+**, **macOS**, o **Linux**
- Puertos disponibles: 3000, 8000, 5432, 9000 (PostgreSQL, FastAPI, Frontend, SonarQube)

---

## ⚡ Inicio Rápido

### 1. Clonar o descargar el proyecto
```bash
cd tu-directorio-del-proyecto
```

### 2. Construir e iniciar los servicios
```bash
docker compose up -d --build
```

Este comando:
- ✅ Crea y inicia el contenedor PostgreSQL
- ✅ Crea y inicia el contenedor FastAPI
- ✅ Crea y inicia el contenedor pgAdmin
- ✅ Crea y inicia SonarQube
- ✅ Inicializa las tablas de base de datos
- ✅ Carga datos de prueba

### 3. Verificar que todos los servicios estén corriendo
```bash
docker compose ps
```

**Resultado esperado:**
```
NAME                   STATUS
gestorbecas_db        Up (healthy)
gestorbecas_backend   Up
gestorbecas_pgadmin   Up
gestorbecas_sonarqube Up
```

### 4. Acceder a la aplicación

Abre tu navegador e ingresa a:
- **Frontend:** http://localhost:3000
- **API Documentation:** http://localhost:8000/docs
- **pgAdmin:** http://localhost:5050 (usuario: admin@pgadmin.com / password: admin)
- **SonarQube:** http://localhost:9000

---

## 🔐 Credenciales de Prueba

### Acceso a la Aplicación
```
Email: admin@gestorbecas.com
Contraseña: 123456789
Rol: Administrador
```

O con usuario regular:
```
Email: usuarioP@gestorbecas.com
Contraseña: 123456789
Rol: Usuario
```

### Acceso a la Base de Datos (pgAdmin)
```
Usuario: admin@pgadmin.com
Contraseña: admin
```

---

## 📁 Estructura del Proyecto

```
proyecto/
├── app/                          # Código Next.js (Frontend)
│   ├── (admin)/                 # Rutas administrativas
│   │   └── admin-dashboard/
│   ├── (dashboard)/             # Dashboard principal
│   ├── (public)/                # Páginas públicas
│   ├── (usuario)/               # Rutas de usuario
│   ├── auth/                    # Autenticación
│   │   └── login/
│   ├── api/                     # Rutas API
│   │   ├── becas/
│   │   ├── estudiantes/
│   │   ├── solicitudes/
│   │   ├── estadisticas/
│   │   └── exportar/
│   └── globals.css
├── components/                   # Componentes React
│   ├── dashboard/
│   ├── forms/
│   └── ui/
├── lib/                          # Utilidades y tipos
│   ├── auth-context.tsx
│   ├── types.ts
│   └── utils.ts
├── public/                       # Archivos estáticos
├── main.py                       # API Backend (FastAPI)
├── requirements.txt              # Dependencias Python
├── package.json                  # Dependencias Node.js
├── Dockerfile                    # Contenedor Frontend
├── docker-compose.yml            # Orquestación de servicios
├── .env                          # Variables de entorno (Backend)
├── .env.local                    # Variables de entorno (Frontend - Desarrollo)
└── README.md                     # Este archivo

Backend (main.py):
- Modelos SQLAlchemy para: Usuarios, Estudiantes, Becas, Solicitudes, Estadísticas
- Endpoints RESTful para CRUD de todas las entidades
- Autenticación JWT
- CORS habilitado
- Base de datos PostgreSQL
```

---

## 🔧 Configuración de Variables de Entorno

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENV=development
```

### Backend (.env)
```env
API_SECRET_KEY=Cisco_Net_2026_ClaveSegura
DATABASE_URL=postgresql://postgres:postgres@gestorbecas_db:5432/gestorbecas
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=gestorbecas_db
DATABASE_PORT=5432
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://192.168.0.51:3000
ENVIRONMENT=development
```

---

## 📊 Datos de Prueba Precargados

El sistema se inicializa automáticamente con:
- **5 usuarios:** 1 admin + 1 coordinador + 1 revisor + 2 estudiantes
- **50 estudiantes:** Con datos realistas (nombres, emails, promedio, ingreso familiar)
- **15 becas:** Diversas (académica, deportiva, necesidad, investigación)
- **200+ solicitudes:** Con relaciones completas y estados variados

Todos estos datos se cargan automáticamente en el primer inicio.

---

## 🌐 API REST Endpoints

### Autenticación
```
POST   /api/auth/login              # Iniciar sesión
POST   /api/auth/register           # Registrar usuario
GET    /api/auth/me                 # Obtener usuario actual
```

### Estudiantes
```
GET    /api/estudiantes             # Listar todos
GET    /api/estudiantes/{id}        # Obtener por ID
POST   /api/estudiantes             # Crear
PUT    /api/estudiantes/{id}        # Actualizar
DELETE /api/estudiantes/{id}        # Eliminar
```

### Becas
```
GET    /api/becas                   # Listar todas
GET    /api/becas/{id}              # Obtener por ID
POST   /api/becas                   # Crear
PUT    /api/becas/{id}              # Actualizar
DELETE /api/becas/{id}              # Eliminar
```

### Solicitudes
```
GET    /api/solicitudes             # Listar todas
GET    /api/solicitudes/{id}        # Obtener por ID
POST   /api/solicitudes             # Crear
PUT    /api/solicitudes/{id}        # Actualizar
DELETE /api/solicitudes/{id}        # Eliminar
```

### Estadísticas
```
GET    /api/estadisticas            # Obtener estadísticas del sistema
```

### Exportar
```
GET    /api/exportar/excel          # Exportar a Excel
GET    /api/exportar/pdf            # Exportar a PDF
```

**Documentación interactiva:** http://localhost:8000/docs

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────┐
│                  NAVEGADOR WEB                      │
│            (http://localhost:3000)                  │
└────────────────────────┬────────────────────────────┘
                         │
                    FRONTEND
                    Next.js 16
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
   PÁGINAS ESTÁTICAS           APIs (Server Components)
   - Login                      - /api/estadisticas
   - Dashboard                  - /api/solicitudes
   - Estudiantes               - /api/becas
   - Becas                     - /api/estudiantes
   - Solicitudes               - /api/exportar
                                │
                                ▼
                            BACKEND
                          FastAPI/Python
                    (http://localhost:8000)
                  ┌──────────────┴──────────────┐
                  │                             │
                  ▼                             ▼
             AUTENTICACIÓN                DATABASE
             - JWT tokens                PostgreSQL 15
             - BCrypt hashing        (Port 5432)
             - Session management
                  │
                  └─────────────────────────────┘
                          │
                    PERSISTENCIA
                 Docker Volume (b_bucaynbqftc_postgres_data)
```

---

## 🛠️ Comandos Útiles

### Iniciar los servicios
```bash
docker compose up -d
```

### Detener los servicios
```bash
docker compose down
```

### Detener y borrar volúmenes (⚠️ BORRA DATOS)
```bash
docker compose down -v
```

### Ver logs en tiempo real
```bash
docker compose logs -f

# O solo de un servicio específico
docker compose logs -f gestorbecas_backend
docker compose logs -f gestorbecas_db
```

### Acceder a la base de datos
```bash
docker compose exec db psql -U postgres -d gestorbecas
```

### Reconstruir los contenedores
```bash
docker compose build --no-cache
docker compose up -d
```

### Ejecutar migraciones de datos
```bash
# Conectar a la BD y ejecutar script SQL
docker compose exec db psql -U postgres -d gestorbecas -f /docker-entrypoint-initdb.d/004_test_data.sql
```

---

## 📊 Dashboard en Tiempo Real

El dashboard principal (/admin-dashboard) muestra:

**Tarjetas de Estadísticas (Actualización cada 10 segundos):**
- Total Estudiantes (52)
- Becas Activas (15)
- Total Solicitudes (200)
- Solicitudes Aprobadas
- Solicitudes Pendientes
- Solicitudes Rechazadas

**Gráficos (Actualización automática):**
- Distribución de solicitudes por estado
- Distribución por tipo de beca
- Estudiantes por nivel educativo
- Monto total de becas aprobado

**Tabla de Solicitudes Recientes:**
- Últimas 5 solicitudes con datos completos
- Nombre del estudiante y beca asignada
- Estado actual y puntuación

**Botón de Actualizar Manual:**
- Fuerza la actualización inmediata de todos los datos

---

## 🔒 Seguridad

✅ **Autenticación:**
- Contraseñas hasheadas con bcrypt (costo 12)
- Tokens JWT para sesiones

✅ **API:**
- CORS configurado por origen
- Validación de datos con Pydantic

✅ **Base de Datos:**
- Variables de entorno para credenciales
- Conexión encriptada en Docker network

✅ **Frontend:**
- Validación de formularios
- Protección de rutas autenticadas

---

## 🐛 Solución de Problemas

### El servicio Backend no inicia
```bash
# Verificar logs
docker compose logs gestorbecas_backend

# Reiniciar el contenedor
docker compose restart gestorbecas_backend
```

### Error de conexión a la base de datos
```bash
# Verificar que PostgreSQL está corriendo
docker compose ps

# Reiniciar los servicios
docker compose down
docker compose up -d
```

### Frontend muestra "Cannot GET /admin-dashboard"
```bash
# Reconstruir el proyecto
npm run build

# Reiniciar el servicio
docker compose restart gestorbecas_frontend
```

### Puerto ya en uso
```bash
# Cambiar el puerto en docker-compose.yml
# O liberar el puerto existente:
# Windows: netstat -ano | findstr :3000
# Linux/Mac: lsof -i :3000
```

---

## 📈 Escalabilidad y Producción

### Para desplegar en producción:

1. **Crear un archivo `.env.production`** con valores de producción
2. **Usar URLs de dominio** en lugar de localhost
3. **Configurar certificados SSL/TLS**
4. **Usar reverse proxy** (Nginx, Traefik)
5. **Configurar base de datos** en servidor externo
6. **Habilitar backups** automáticos de PostgreSQL
7. **Monitorear logs** con herramientas como ELK Stack

### Ejemplo docker-compose para producción:
```yaml
version: '3.8'
services:
  backend:
    image: my-registry/gestorbecas-backend:latest
    environment:
      - DATABASE_URL=postgresql://user:pass@db-host:5432/gestorbecas
      - API_SECRET_KEY=${API_SECRET_KEY}
    restart: always
    
  frontend:
    image: my-registry/gestorbecas-frontend:latest
    restart: always
```

---

## 📞 Soporte y Contacto

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

---

## 📄 Licencia

Este proyecto está bajo licencia privada. Todos los derechos reservados.

---

## 🎯 Próximas Mejoras

- [ ] Autenticación con OAuth2/Google
- [ ] Notificaciones por email
- [ ] Sistema de seguimiento de cambios (audit log)
- [ ] Gráficos más avanzados con D3.js
- [ ] Búsqueda full-text en solicitudes
- [ ] API GraphQL alternativa
- [ ] Aplicación móvil (React Native)
- [ ] Integración con sistemas de pago

---

**Versión:** 1.0.0  
**Última actualización:** 2026-05-29  
**Desarrollado con ❤️ para gestión eficiente de becas**
