@echo off
rem — Cambia al directorio donde está este .bat
cd /d "%~dp0"

rem — Comprueba que Node y Yarn están en el PATH
where node >nul 2>&1 || (
  echo ERROR: No se encuentra node.exe en el PATH
  pause
  exit /b 1
)
where yarn >nul 2>&1 || (
  echo ERROR: No se encuentra yarn.cmd en el PATH
  pause
  exit /b 1
)

rem — Ejecuta tu script de inicio
yarn start

rem — Mantiene la ventana abierta para leer mensajes
pause
