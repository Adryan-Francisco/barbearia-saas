@echo off
REM Script para iniciar o SaaS de Barbearia

echo ======================================
echo   Iniciando Barbearia SaaS
echo ======================================

REM Abrir em dois terminais
start "Backend - Barbearia" cmd /k "cd /d c:\Users\thiag\OneDrive\Documentos\PROJETOS\Barbearia\backend && npm run dev"
timeout /t 3 /nobreak
start "Frontend - Barbearia" cmd /k "cd /d c:\Users\thiag\OneDrive\Documentos\PROJETOS\Barbearia\frontend && npm run dev"

echo.
echo Backend iniciado em: http://localhost:3001
echo Frontend iniciado em: http://localhost:3000
echo.
echo Aguarde os servidores iniciarem completamente...
