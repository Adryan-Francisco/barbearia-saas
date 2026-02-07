@echo off
REM Script para iniciar o SaaS de Barbearia com Backend + Frontend

echo ======================================
echo   Iniciando Barbearia SaaS
echo ======================================
echo.

REM Definir o caminho base do projeto
set PROJECT_PATH=c:\Users\adrya\Documents\Projetos\barbearia-saas

REM Abrir Backend em um terminal
echo [1/2] Iniciando Backend na porta 3001...
start "Backend - Barbearia SaaS" cmd /k "cd /d %PROJECT_PATH%\backend && npm run dev"

REM Aguardar 3 segundos
timeout /t 3 /nobreak

REM Abrir Frontend em outro terminal
echo [2/2] Iniciando Frontend na porta 3000...
start "Frontend - Barbearia SaaS" cmd /k "cd /d %PROJECT_PATH%\frontend && npm run dev"

echo.
echo ======================================
echo   Servidores iniciados!
echo   Backend: http://localhost:3001
echo   Frontend: http://localhost:3000
echo ======================================
echo.
pause
start "Frontend - Barbearia" cmd /k "cd /d c:\Users\thiag\OneDrive\Documentos\PROJETOS\Barbearia\frontend && npm run dev"

echo.
echo Backend iniciado em: http://localhost:3001
echo Frontend iniciado em: http://localhost:3000
echo.
echo Aguarde os servidores iniciarem completamente...
