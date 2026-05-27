#!/usr/bin/env pwsh
# ========================================
# SCRIPT DE DESPLIEGUE AUTOMÁTICO
# Proyecto POKEDEX - Docker Compose
# ========================================

Write-Host "
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║    🐳 INICIANDO PROYECTO POKEDEX CON DOCKER COMPOSE 🐳   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# ========================================
# PASO 1: Verificar que Docker está corriendo
# ========================================
Write-Host "`n[1/5] Verificando Docker..." -ForegroundColor Yellow

$maxRetries = 10
$retry = 0
while ($retry -lt $maxRetries) {
    try {
        $dockerVersion = docker ps 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Docker está corriendo" -ForegroundColor Green
            break
        }
    } catch {
        $retry++
        if ($retry -lt $maxRetries) {
            Write-Host "⏳ Esperando a que Docker inicie... ($retry/$maxRetries)" -ForegroundColor Gray
            Start-Sleep -Seconds 2
        } else {
            Write-Host "❌ Docker no responde. Por favor inicia Docker Desktop manualmente." -ForegroundColor Red
            exit 1
        }
    }
}

# ========================================
# PASO 2: Limpiar despliegues anteriores
# ========================================
Write-Host "`n[2/5] Limpiando containers anteriores..." -ForegroundColor Yellow

$currentDir = Get-Location
Write-Host "📁 Directorio actual: $currentDir" -ForegroundColor Gray

try {
    docker compose down -v 2>&1 | Out-Null
    Write-Host "✅ Containers limpios" -ForegroundColor Green
} catch {
    Write-Host "⚠️  No había containers previos (es normal)" -ForegroundColor Gray
}

# ========================================
# PASO 3: Construir imágenes Docker
# ========================================
Write-Host "`n[3/5] Construyendo imágenes Docker (esto tardará 2-3 minutos)..." -ForegroundColor Yellow

try {
    docker compose build --no-cache
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al construir imágenes" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Imágenes construidas exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    exit 1
}

# ========================================
# PASO 4: Iniciar containers
# ========================================
Write-Host "`n[4/5] Iniciando containers..." -ForegroundColor Yellow

try {
    # Iniciar en background
    docker compose up -d
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al iniciar containers" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Containers iniciados" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    exit 1
}

# ========================================
# PASO 5: Esperar a que los servicios estén listos
# ========================================
Write-Host "`n[5/5] Esperando a que los servicios estén listos (30-60 segundos)..." -ForegroundColor Yellow

$waitTime = 0
$maxWait = 120

while ($waitTime -lt $maxWait) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8000/docs" -Method Get -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response) {
            Write-Host "✅ Backend está listo" -ForegroundColor Green
            break
        }
    } catch {
        $waitTime += 2
        Write-Host "⏳ Backend iniciando... ($waitTime segundos)" -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
}

if ($waitTime -ge $maxWait) {
    Write-Host "⚠️  Backend tardó más de lo esperado. Continuando de todas formas..." -ForegroundColor Yellow
}

# ========================================
# VERIFICACIÓN FINAL
# ========================================
Write-Host "`n" -ForegroundColor Green

try {
    $logs = docker compose logs --tail=5 2>&1
    Write-Host "📊 Últimos logs de servicios:" -ForegroundColor Cyan
    Write-Host $logs -ForegroundColor Gray
} catch {
    Write-Host ""
}

# ========================================
# RESUMEN Y URLS
# ========================================
Write-Host "
╔════════════════════════════════════════════════════════════╗
║                  ✅ PROYECTO INICIADO EXITOSAMENTE ✅     ║
╚════════════════════════════════════════════════════════════╝
" -ForegroundColor Green

Write-Host "
🌐 URLS DISPONIBLES:
" -ForegroundColor Cyan

Write-Host "   📱 Frontend:          http://localhost:5500" -ForegroundColor White
Write-Host "   🔧 Backend API:       http://localhost:8000" -ForegroundColor White
Write-Host "   📚 Documentación:     http://localhost:8000/docs" -ForegroundColor White
Write-Host "   💾 Base de datos:     /data/pokemon.db" -ForegroundColor White

Write-Host "
📋 COMANDOS ÚTILES:
" -ForegroundColor Cyan

Write-Host "   Ver logs:             docker compose logs -f" -ForegroundColor Gray
Write-Host "   Detener proyecto:     docker compose down" -ForegroundColor Gray
Write-Host "   Reiniciar:            docker compose restart" -ForegroundColor Gray
Write-Host "   Ejecutar pruebas:     & '.\.venv\Scripts\python.exe' test_api.py" -ForegroundColor Gray

Write-Host "
🎉 ¡Listo para empezar!
" -ForegroundColor Green

Write-Host "Abre tu navegador en:" -ForegroundColor Yellow
Write-Host "➜ http://localhost:5500" -ForegroundColor Cyan
