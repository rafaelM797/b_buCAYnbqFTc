@echo off
REM ============================================
REM Script de Automatización - Proyecto Pokedex
REM ============================================

setlocal enabledelayedexpansion
cls

echo.
echo ========================================
echo    POKEDEX - DOCKER SETUP
echo ========================================
echo.

REM Verificar si estamos en el directorio correcto
if not exist "docker-compose.yml" (
    echo [ERROR] docker-compose.yml no encontrado.
    echo Asegúrate de ejecutar este script desde la raíz del proyecto.
    pause
    exit /b 1
)

echo [1/4] Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no está instalado o no está en PATH
    echo Instala Docker Desktop desde https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo [OK] Docker encontrado

echo.
echo [2/4] Limpiando contenedores previos...
docker compose down -v 2>nul
echo [OK] Limpieza completada

echo.
echo [3/4] Construyendo imágenes...
docker compose build --no-cache
if errorlevel 1 (
    echo [ERROR] Error al construir las imágenes
    pause
    exit /b 1
)
echo [OK] Imágenes construidas

echo.
echo [4/4] Iniciando contenedores...
docker compose up -d
if errorlevel 1 (
    echo [ERROR] Error al iniciar los contenedores
    pause
    exit /b 1
)
echo [OK] Contenedores iniciados

REM Esperar a que los servicios estén listos
echo.
echo Esperando a que los servicios estén listos...
timeout /t 5 /nobreak

REM Verificar que los contenedores están corriendo
docker compose ps
echo.

REM Mostrar información de acceso
echo.
echo ========================================
echo      ACCESO A LA APLICACIÓN
echo ========================================
echo.
echo Frontend:      http://localhost:5500
echo Backend API:   http://localhost:8000
echo Swagger Docs:  http://localhost:8000/docs
echo.
echo ========================================
echo.

REM Preguntar si abrir en navegador
set /p open_browser="¿Abrir el Frontend en el navegador? (s/n): "
if /i "%open_browser%"=="s" (
    start http://localhost:5500
)

echo.
echo [INFO] Para ver logs en tiempo real: docker compose logs -f
echo [INFO] Para detener: docker compose down
echo [INFO] Presiona Enter para salir...
pause >nul

endlocal
