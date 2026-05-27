# 🐳 POKEDEX - PROYECTO DOCKERIZADO

## 📌 Descripción Rápida

Este es el proyecto **Pokedex** con arquitectura completa:
- **Frontend:** Next.js + Nginx (puerto 5500)
- **Backend:** FastAPI + Python (puerto 8000)
- **Base de datos:** SQLite con persistencia
- **Orquestación:** Docker Compose

---

## ⚡ INICIO RÁPIDO (< 5 minutos)

### Opción 1: Script Automático (Recomendado)

#### En Windows (CMD):
```cmd
setup.bat
```

#### En Windows (PowerShell):
```powershell
powershell -ExecutionPolicy Bypass -File setup.ps1
```

### Opción 2: Manual

```powershell
# 1. Navega al directorio
cd c:\Users\dell\Desktop\b_buCAYnbqFTc\b_buCAYnbqFTc

# 2. Construye e inicia
docker compose up --build

# 3. Espera a que termine y abre en navegador
# http://localhost:5500
```

---

## 🌐 ACCESO A LA APLICACIÓN

| Componente | URL | Descripción |
|-----------|-----|-------------|
| **Frontend** | http://localhost:5500 | Interfaz de usuario |
| **Backend API** | http://localhost:8000 | API REST |
| **Swagger Docs** | http://localhost:8000/docs | Documentación interactiva |

---

## 📁 DOCUMENTACIÓN

### Para Usuarios
- **[GUIA_DOCKER.md](GUIA_DOCKER.md)** - Guía completa de ejecución
- **[COMANDOS_RAPIDOS.md](COMANDOS_RAPIDOS.md)** - Comandos listos para copiar/pegar
- **[CHECKLIST_VERIFICACION.md](CHECKLIST_VERIFICACION.md)** - Verificar todas las fases

### Para Desarrolladores
- **[RESUMEN_COMPLETO.md](RESUMEN_COMPLETO.md)** - Resumen técnico completo
- **[.env.example](.env.example)** - Template de variables de entorno
- **[docker-compose.yml](docker-compose.yml)** - Configuración de servicios
- **[Dockerfile](Dockerfile)** - Build del backend
- **[frontend/Dockerfile](frontend/Dockerfile)** - Build del frontend

---

## ✅ CHECKLIST DE INICIO

- [ ] Docker Desktop instalado y ejecutándose
- [ ] Terminal abierta en el directorio del proyecto
- [ ] `docker compose up --build` ejecutado
- [ ] Backend responde en http://localhost:8000
- [ ] Frontend carga en http://localhost:5500
- [ ] Base de datos SQLite creada
- [ ] No hay errores CORS en consola (F12)
- [ ] API Key está configurada en `.env`

---

## 🧪 FASES DE PRUEBA

### Fase 1: Smoke Testing ✅
Verifica que los servicios iniciaron:
```powershell
docker compose ps
```

### Fase 2: Connectivity Testing ✅
Verifica que el backend responde:
```powershell
curl http://localhost:8000/docs
```

### Fase 3: Integration Testing ✅
1. Abre http://localhost:5500
2. Abre DevTools (F12)
3. Verifica que no haya errores de CORS

### Fase 4: Database Persistence Testing ✅
1. Guarda un favorito
2. `docker compose down` y `docker compose up`
3. Verifica que el favorito persiste

### Fase 5: Security Testing ✅
```powershell
# Sin API Key - debe fallar
curl -X POST http://localhost:8000/favoritos

# Con API Key - debe funcionar
curl -X POST http://localhost:8000/favoritos `
  -H "X-API-KEY: Cisco_Net_2026_ClaveSegura"
```

---

## 📊 ARQUITECTURA

```
┌─────────────────────────────────────────────┐
│           USUARIO (Navegador)               │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │  FRONTEND (5500)    │
         │  Next.js + Nginx    │
         └──────────┬──────────┘
                    │
            ┌───────▼────────┐
            │  pokedex-      │
            │  network       │
            │  (Docker)      │
            └───────┬────────┘
                    │
         ┌──────────▼──────────┐
         │  BACKEND (8000)     │
         │  FastAPI + Python   │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────┐
         │   SQLite Database   │
         │   (pokemon.db)      │
         └─────────────────────┘
```

---

## 🔐 SEGURIDAD IMPLEMENTADA

| Aspecto | Implementación |
|--------|----------------|
| **API Key** | Header `X-API-KEY` requerido |
| **CORS** | Configurado en FastAPI |
| **Variables Secretas** | Almacenadas en `.env` (no hardcodeadas) |
| **Reverse Proxy** | Nginx protegiendo el frontend |
| **Health Checks** | Verificación automática de servicios |

---

## 🛠️ COMANDOS ÚTILES

### Información y Monitoreo

```powershell
# Ver estado de contenedores
docker compose ps

# Ver logs en tiempo real
docker compose logs -f

# Ver logs del backend
docker compose logs backend -f

# Ver logs del frontend
docker compose logs frontend -f
```

### Control de Servicios

```powershell
# Iniciar servicios
docker compose up

# Iniciar en background
docker compose up -d

# Detener servicios
docker compose down

# Reiniciar servicios
docker compose restart

# Reconstruir imágenes
docker compose build --no-cache
```

### Acceso a Contenedores

```powershell
# Terminal del backend
docker compose exec backend bash

# Terminal del frontend
docker compose exec frontend sh

# Ejecutar comando en backend
docker compose exec backend python main.py
```

---

## 📋 REQUISITOS

### Mínimos
- Docker Desktop 4.0+
- Windows 11 con WSL 2
- 2GB RAM disponible
- 5GB espacio en disco

### Recomendado
- Docker Desktop 4.25+
- Windows 11 con WSL 2 actualizado
- 4GB RAM disponible
- 10GB espacio en disco
- PowerShell 7+

---

## ❓ PREGUNTAS FRECUENTES

### P: El puerto 5500 o 8000 ya está en uso
**R:** Edita `docker-compose.yml` y cambia los puertos:
```yaml
backend:
  ports:
    - "8001:8000"  # Cambiar a 8001

frontend:
  ports:
    - "5501:80"    # Cambiar a 5501
```

### P: Cómo ver la base de datos
**R:** Accede al contenedor y verifica:
```powershell
docker compose exec backend sqlite3 pokemon.db "SELECT * FROM favoritos;"
```

### P: Cómo reiniciar limpiamente
**R:** 
```powershell
docker compose down -v  # Elimina todo incluyendo volúmenes
docker compose up --build  # Reconstruye desde cero
```

### P: Cómo cambiar la API Key
**R:** Edita el archivo `.env`:
```env
API_SECRET_KEY=tu_clave_segura_aqui
```
Luego reinicia: `docker compose restart`

### P: Los datos no persisten
**R:** Verifica que el volumen está configurado en `docker-compose.yml` y existe:
```powershell
docker volume ls
```

---

## 🚀 PRÓXIMOS PASOS

1. **Ejecuta** el script de setup (`setup.bat` o `setup.ps1`)
2. **Espera** a que se construyan las imágenes (2-3 minutos)
3. **Abre** http://localhost:5500 en tu navegador
4. **Completa** el CHECKLIST_VERIFICACION.md
5. **Captura** evidencia de todas las pruebas

---

## 📝 VERSIONES

| Componente | Versión |
|-----------|---------|
| Docker Compose | 3.8 |
| Python | 3.11 |
| FastAPI | 0.109.0 |
| Uvicorn | 0.27.0 |
| Node.js | 20-alpine |
| Nginx | latest-alpine |
| Next.js | (según package.json) |

---

## 📞 SOPORTE

Si encuentras problemas:

1. Revisa **COMANDOS_RAPIDOS.md** para soluciones rápidas
2. Consulta **GUIA_DOCKER.md** para instrucciones detalladas
3. Verifica logs: `docker compose logs`
4. Reinicia limpiamente: `docker compose down -v && docker compose up --build`

---

## 📄 LICENCIA

Proyecto educativo - Libre para uso personal y educativo.

---

## ✨ FEATURES

✅ **Frontend Next.js** - Interfaz moderna y responsiva
✅ **Backend FastAPI** - API REST rápida y segura
✅ **Docker Compose** - Orquestación simplificada
✅ **Base de Datos SQLite** - Persistencia local
✅ **Documentación Swagger** - API interactiva en /docs
✅ **Health Checks** - Monitoreo automático
✅ **Reverse Proxy Nginx** - Seguridad y performance
✅ **Variables de Entorno** - Configuración flexible
✅ **Scripts de Automatización** - Setup en un click
✅ **Documentación Completa** - Guías step-by-step

---

**¡Tu proyecto Pokedex está listo para usar! 🚀**

Ejecuta `setup.bat` o `setup.ps1` y accede a http://localhost:5500
