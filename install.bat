@echo off
setlocal enabledelayedexpansion

REM Instalar dependências do backend
cd /d "c:\Users\thiag\OneDrive\Documentos\PROJETOS\Barbearia\backend"
echo Instalando dependências do backend...
call npm install --no-audit

REM Instalar dependências do frontend
cd /d "c:\Users\thiag\OneDrive\Documentos\PROJETOS\Barbearia\frontend"
echo Instalando dependências do frontend...
call npm install --no-audit

echo Instalação concluída!
pause
