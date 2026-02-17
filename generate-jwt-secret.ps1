#!/usr/bin/env pwsh
# Script para gerar JWT_SECRET seguro para produção

Write-Host "🔐 Gerando JWT_SECRET seguro para BarberFlow..." -ForegroundColor Cyan

# Gerar 32 bytes aleatórios
$bytes = [System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32)
$secret = [Convert]::ToBase64String($bytes)

Write-Host ""
Write-Host "✅ JWT_SECRET gerado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Copie o valor abaixo para seu arquivo .env:" -ForegroundColor Yellow
Write-Host ""
Write-Host $secret -ForegroundColor Magenta
Write-Host ""

# Copiar para clipboard (Windows)
$secret | Set-Clipboard
Write-Host "📋 Valor copiado para clipboard!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Abra backend/.env"
Write-Host "2. Procure por JWT_SECRET="
Write-Host "3. Cole o valor copiado"
Write-Host ""
