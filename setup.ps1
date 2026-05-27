# ============================================
# Script de Automatización - Proyecto Pokedex
# Ejecutar con: powershell -ExecutionPolicy Bypass -File setup.ps1
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   POKEDEX - DOCKER SETUP AUTOMATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si estamos en el directorio correcto
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "[ERROR] docker-compose.yml no encontrado." -ForegroundColor Red
    Write-Host "Asegúrate de ejecutar este script desde la raíz del proyecto." -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar Docker
Write-Host "[1/4] Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "[OK] Docker encontrado: $dockerVersion" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Docker no está instalado o no está en PATH" -ForegroundColor Red
    Write-Host "Instala Docker Desktop desde https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Limpiar contenedores previos
Write-Host ""
Write-Host "[2/4] Limpiando contenedores previos..." -ForegroundColor Yellow
docker compose down -v 2>$null
Write-Host "[OK] Limpieza completada" -ForegroundColor Green

# Construir imágenes
Write-Host ""
Write-Host "[3/4] Construyendo imágenes..." -ForegroundColor Yellow
docker compose build --no-cache
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Error al construir las imágenes" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}
Write-Host "[OK] Imágenes construidas" -ForegroundColor Green

# Iniciar contenedores
Write-Host ""
Write-Host "[4/4] Iniciando contenedores..." -ForegroundColor Yellow
docker compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Error al iniciar los contenedores" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}
Write-Host "[OK] Contenedores iniciados" -ForegroundColor Green

# Esperar a que los servicios estén listos
Write-Host ""
Write-Host "Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Mostrar estado de los contenedores
Write-Host ""
docker compose ps
Write-Host ""

# Mostrar información de acceso
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "      ACCESO A LA APLICACIÓN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend:      http://localhost:5500" -ForegroundColor Green
Write-Host "Backend API:   http://localhost:8000" -ForegroundColor Green
Write-Host "Swagger Docs:  http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Preguntar si abrir en navegador
$openBrowser = Read-Host "¿Abrir el Frontend en el navegador? (s/n)"
if ($openBrowser -eq "s" -or $openBrowser -eq "S") {
    Start-Process "http://localhost:5500"
}

# Mostrar comando para logs
Write-Host ""
Write-Host "[INFO] Para ver logs en tiempo real:" -ForegroundColor Yellow
Write-Host "       docker compose logs -f" -ForegroundColor Gray
Write-Host "[INFO] Para detener:" -ForegroundColor Yellow
Write-Host "       docker compose down" -ForegroundColor Gray
Write-Host ""

# Esperar entrada del usuario
Read-Host "Presiona Enter para salir"
